var locaterService = require('./locater_service')

var descriptions = {
  findPainter: "find a painter"
}

var outcomes = {
  findPainter: {
    call: locaterService('painter'),
    description: 'find a painter'
  },
  findPlumber: {
    call: locaterService('plumber'),
    description: 'find a plumber'
  },
  findChineseFood: {
    call: locaterService('chinese food')
    description: 'find some oh-so-delicious chinese food'
  },
  hello: {
    call: (response, convo) => {
      convo.say('Greeting, and salutations!')
      convo.next()
    },
    description: 'say hello',
    skipConfirmation: false
  }
}

camelize = (str) => str.replace(/[\W_]+(\w)/g, ($0, $1) => $1.toUpperCase())

module.exports = {
  intent: (outcome) => {
    var ref = outcomes[camelize(outcome.intent)]
    return (ref && ref.call)
  },
  description: (outcome) => outcomes[camelize(outcome.intent)].description,
  skipConfirmation: () => false
}
