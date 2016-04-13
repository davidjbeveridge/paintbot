var locaterService = require('./locater_service')

var intents = {
  findPainter: locaterService('painter')
}

var descriptions = {
  findPainter: "find a painter"
}

camelize = (str) => str.replace(/[\W_]+(\w)/g, ($0, $1) => $1.toUpperCase())

module.exports = {
  intent: (outcome) => intents[camelize(outcome.intent)],
  description: (outcome) => descriptions[camelize(outcome.intent)]
}
