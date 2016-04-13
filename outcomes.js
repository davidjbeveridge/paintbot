var locaterService = require('./locater_service')

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
    call: locaterService('chinese food'),
    description: 'find some oh-so-delicious chinese food'
  },
  hello: {
    call: (response, convo) => {
      greetings = [
        'Hi there.',
        'Greetings and salutations!',
        'Bom dia',
        'Bonjour',
        'Buongiorno',
        'Aloha',
        'Yo.'
      ]
      random = (new Date).getMilliseconds() % greetings.length
      convo.say(greetings[random])
      convo.next()
    },
    description: 'say hello',
    skipConfirmation: true
  }
}

camelize = (str) => str.replace(/[\W_]+(\w)/g, ($0, $1) => $1.toUpperCase())

var getOutcomeProp = (outcome, prop) => {
  var ref = outcomes[camelize(outcome.intent)]
  return (ref && ref[prop])
}

module.exports = {
  intent: (outcome) => getOutcomeProp(outcome, 'call'),
  description: (outcome) => getOutcomeProp(outcome, 'description'),
  skipConfirmation: (outcome) => getOutcomeProp(outcome, 'skipConfirmation')
}
