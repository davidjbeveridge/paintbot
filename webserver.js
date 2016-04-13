var express = require('express')
var server = express();

server.get('/', (req, res) => {
  res.send('Paintbot lives here. Just talk to @paintbot on slack.')
})

exports.start = () => {
  server.listen(process.env.PORT || 3000)
  console.log("SERVER RUNNING")
}
