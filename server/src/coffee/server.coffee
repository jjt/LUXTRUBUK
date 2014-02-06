express = require 'express'
config = require('./lib/config')(process)
_ = require 'lodash'


dir = process.cwd()
app = express()

app.get '/api/game/randomHash', (req, res)->
  res.send _.sample require('./lib/gameHashes')

app.configure ()->
  app.use express.static(config.staticDir)

#app.get '/api/game/random', (req, res) ->
  #api.getRandomGameHash null, (err, hash)->
    #res.redirect "/api/game/#{hash}"

#app.get '/api/game/:gamehash', (req, res) ->
  #api.getGame null, req.params.gamehash, (err, game) ->
    #res.send JSON.stringify game

port = +process.env.PORT || 3000
app.listen port, ()->
  console.log "LUXTRUBUK UP IN IT ON PORT #{port}"
