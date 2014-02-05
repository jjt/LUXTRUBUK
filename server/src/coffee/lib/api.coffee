pg = require 'pg'
Promise = require('bluebird')
constring = require('./config.LOCAL').constring
pg.defaults.poolSize = 2

clientConnect = (next = ()->) ->
  pg.connect constring, (err, client, done) ->
    if err
      console.log "clientConnect ERROR"
      console.log err
      return next err
    next(err, client, done)

runQuery = (err, query, next = ()->) ->
  clientConnect (err, client, done) ->
    client.query query, (err, result) ->
      if err
        console.log err
        return next err
      client.end()
      done(1)
      next(err, result)


getAllClues = (err, next = ()->)->
  fields = "clue, answer, value, category, round, cluehash"
  query = "SELECT #{fields} FROM clues_flat ORDER BY round, category, value"
  runQuery err, query, (err, result)->
    next err, result?.rows


getGameHashes = (err, next = ()->)->
  query = "select gamehash from clues_flat group by gamehash order by gamehash"
  runQuery err, query, (err, result)->
    next err, result?.rows.map((obj)->obj.gamehash)

#getRandomGameId = (err, next = ()->) ->
  #offset = "random() * (SELECT count(*) FROM clues_flat)"
  #query = "SELECT game FROM clues_flat OFFSET #{offset} LIMIT 1"
  #runQuery err, query, (err, result) ->
      #if err
        #console.log err
        #return next err
      #client.end()
      #next(err, result.rows[0].game)

getGame = (err, gamehash, next = ()->) ->
  return if not gamehash?
  fields = "clue, answer, value, category, round, cluehash"
  query = "SELECT #{fields} FROM clues_flat WHERE gamehash='#{gamehash}'
    ORDER BY round, category, value"
  runQuery err, query, (err, result) ->
    if err
      console.log "getGAME ERROR"
      console.log err
      return err
    next err, result.rows

getRandomGame = (err, next = ()->) ->
  getRandomGameId (gameId) ->
    getGame gameId, next

getRandomGameHash = (err, next = ()->) ->
  offset = "random() * (SELECT count(*) FROM clues_flat)"
  query = "SELECT gamehash FROM clues_flat OFFSET #{offset} LIMIT 1"
  runQuery err, query, (err, result) ->
    next err, result.rows[0].gamehash

module.exports =
  {getGame, getRandomGame, getRandomGameHash, getGameHashes, getAllClues}

