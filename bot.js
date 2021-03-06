require('dotenv').config()

require('./webserver').start()

var SLACK_API_TOKEN = process.env.SLACK_API_TOKEN
var WIT_TOKEN = process.env.WIT_TOKEN
var Botkit = require('botkit')
var googlemaps = require('googlemaps')

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: SLACK_API_TOKEN,
}).startRTM()

var wit = require('botkit-middleware-witai')({
    token: WIT_TOKEN
});

controller.middleware.receive.use(wit.receive);

var outcomes = require('./outcomes')
var max = (arr) => arr.reduce(((max, current) => max > current ? max : current), null)

var performIntentFor = (outcome) => (response, convo) => outcomes.intent(outcome)(response, convo)

var confirmOutcome = (bot, outcome) => (response, convo) => {
  if(outcomes.skipConfirmation(outcome)) return performIntentFor(outcome)(response, convo)
  var outcomeText = outcomes.description(outcome)
  convo.ask(`Ok, you want to ${outcomeText}. Is that right?`, [{
    pattern: bot.utterances.yes,
    callback: (response, convo) => {
      performIntentFor(outcome)(response, convo)
    }
  }, {
    default: true,
    callback: (response, convo) => {
      convo.say("Ok. Sorry I got that wrong. Let's try again.")
      convo.next()
    }
  }])
  convo.next()
}

controller.hears(['^.*$'], ['direct_message', 'direct_mention', 'mention', 'channel', wit.hears], (bot, message) => {
  var outcome = max(message.intents || [])
  if(outcome && outcome.confidence > 0.5) return bot.startConversation(message, confirmOutcome(bot, outcome))
  bot.startConversation(message, confirmOutcome(bot, {intent: 'mountain_lion'}))
})

