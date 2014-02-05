async = require 'async'
api = require './api'
fs = require 'fs'

# Builds a CommonJS module of the game hashes
outputHashesModule = (err, next=()->)->
  api.getGameHashes null, (err, hashes)->
    if err? then throw err
    file = 'gameHashes.coffee'
    fs.writeFile file, "module.exports = " + JSON.stringify(hashes), (err)->
      if err? then throw err
      console.log 'Saved gamehashes file successfully!', file
      next hashes

makeGameFile = (hash, next)->
  api.getGame null, hash, (err, clues)->
    file = __dirname + "/../../../../client/public/data/games/#{hash}.json"
    fs.writeFile file, JSON.stringify(clues), (err)->
      if err? then throw err
      console.log "Saved game #{hash}"
      next()

makeGameFiles = (hashes)->
  console.log hashes.length
  hashes.forEach makeGameFile

main = ()->
  outputHashesModule null, (hashes)->
    hashFns = hashes.map (hash)->
      (cb)->
        makeGameFile hash, cb
    async.series hashFns

main()
