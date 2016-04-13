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
  },
  mountainLion: {
    call: (response, convo) => {
      delaySay = (timeout, msg) => {
        setTimeout(() => {
          console.log(msg)
          convo.next()
          convo.say(msg)
          convo.next()
        }, timeout)
      }
      convo.say("Ok... looking for mountain lions now...")
      delaySay(1000, '...')
      delaySay(2000, '...')
      delaySay(3000, '...')
      delaySay(4000, 'Say, is this legal?...')
      delaySay(5000, "I think I'm going to have to pass on this. You can deal with the EPA yourself.")
    },
    description: 'buy a mountain lion'
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
