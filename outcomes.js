var GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
var GoogleMapsApi = require('googlemaps')
var gmApi = new GoogleMapsApi({
  key: GOOGLE_MAPS_API_KEY,
  secure: true
})

var getLocation = (response, convo, callback) => {
  convo.ask("Where are you located?", (response, convo) => {
    gmApi.geocode({address: response.text}, (err, result) => {
      if(err) return callback(err)
      try {
        var lat = result.results[0].geometry.location.lat
        var lon = result.results[0].geometry.location.lng
        var address = result.results[0].formatted_address
        callback(err, lat, lon)
      } catch(e) {
        callback('No info available', null, null, null, result)
      }
    })
  })
  convo.next()
}

var placesLookup = (lat, lon, address, searchTerm, callback) => {
  var searchParams = {
    location: `${lat},${lon}`,
    rankby: 'distance',
    keyword: searchTerm
  }
  gmApi.placeSearch(searchParams, (err, result) => {
    if(err || result.status !== 'OK') return callback(err, result.status, result.results)
    // Presumably, we got good results, since status === 'OK'
    var placeIds = result.results.slice(0, 3).map(place => place.place_id)
    var results = [];
    placeIds.forEach(placeId => {
      gmApi.placeDetails({placeid: placeId}, (err, result) => {
        if(err || result.status !== 'OK') return callback(err, result.status, [result.result])
        results.push(result.result)
        if(results.length == placeIds.length) callback(null, 'OK', results)
      })
    })
  })
}

var handleError = (err, convo, msg) => {
  return !!(err && (convo.say(msg), convo.next()))
}

var tellResults = (convo, status, places) => {
  if(status === 'OK') {
    var placesInfo = places.map(x => [x.name, x.formatted_address, x.formatted_phone_number].join("\n")).join("\n\n")
    convo.say(`Ok, I found ${places.length} places:\n\n${placesInfo}`)
  } else {
    convo.say("I couldn't find anything in your area :(")
  }
  convo.next()
}

var intents = {
  findPainter: (response, convo) => {
    getLocation(response, convo, (err, lat, lon, address) => {
      handleError(err, convo, "Sorry, but I couldn't locate that.") || placesLookup(lat, lon, address, 'painter', (err, status, places) => {
        handleError(err, convo, "Sorry, but I couldn't find any results in your area.") || tellResults(convo, status, places) })
    })
  }
}

var descriptions = {
  findPainter: "find a painter"
}

camelize = (str) => str.replace(/[\W_]+(\w)/g, ($0, $1) => $1.toUpperCase())

module.exports = {
  intent: (outcome) => intents[camelize(outcome.intent)],
  description: (outcome) => descriptions[camelize(outcome.intent)]
}
