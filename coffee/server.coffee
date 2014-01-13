express = require 'express'
getClues = require './lib/getClues'

app = express()

app.get '/', (req, res) ->
  getClues.getRandomGame (result)->
    res.send JSON.stringify result

app.listen 3000
console.log 'LUXTRUBUK UP IN IT!'
