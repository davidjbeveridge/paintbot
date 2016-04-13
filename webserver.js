var express = require('express')
var server = express();

server.get('/', (req, res) => {
  res.send('Paintbot live here')
})

exports.start = () => server.listen(process.env.PORT)
