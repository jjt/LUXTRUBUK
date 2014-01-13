pg = require 'pg'
constring = require('./config.LOCAL').constring

clientConnect = (next = ()->) ->
  pg.connect constring, (err, client, done) ->
    if err
      return console.error 'ERROR with connection', err
    next(client)

getRandomGameId = (next = ()->) ->
  clientConnect (client) ->
    query = "SELECT game FROM clues_flat OFFSET random() * (SELECT count(*) FROM clues_flat) LIMIT 1"
    client.query query, (err, result) ->
      if err
        return console.error "ERROR with get random game id", err
      console.log "RANDOM GAME ID #{result.rows[0].game}"
      next(result.rows[0].game)
      client.end()

getGame = (gameId = 4, next = ()->) ->
  clientConnect (client) ->
    query ="SELECT * FROM clues_flat WHERE game=#{gameId}
      ORDER BY round, category, value"
    client.query query, (err, result) ->
      if err
        return console.error 'ERROR with query', err
      console.log "YEAH QUERIED #{result.rows[0].clue}"
      next(result)
      client.end()
      
getRandomGame = (next = ()->) ->
  getRandomGameId (gameId) ->
    getGame gameId, next

module.exports =
  getGame: getGame
  getRandomGame: getRandomGame
