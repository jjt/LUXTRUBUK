var clientConnect, constring, getGame, getRandomGame, getRandomGameId, pg;

pg = require('pg');

constring = require('./config.LOCAL').constring;

clientConnect = function(next) {
  if (next == null) {
    next = function() {};
  }
  return pg.connect(constring, function(err, client, done) {
    if (err) {
      return console.error('ERROR with connection', err);
    }
    return next(client);
  });
};

getRandomGameId = function(next) {
  if (next == null) {
    next = function() {};
  }
  return clientConnect(function(client) {
    var query;
    query = "SELECT game FROM clues_flat OFFSET random() * (SELECT count(*) FROM clues_flat) LIMIT 1";
    return client.query(query, function(err, result) {
      if (err) {
        return console.error("ERROR with get random game id", err);
      }
      console.log("RANDOM GAME ID " + result.rows[0].game);
      next(result.rows[0].game);
      return client.end();
    });
  });
};

getGame = function(gameId, next) {
  if (gameId == null) {
    gameId = 4;
  }
  if (next == null) {
    next = function() {};
  }
  return clientConnect(function(client) {
    var query;
    query = "SELECT * FROM clues_flat WHERE game=" + gameId + "      ORDER BY round, category, value";
    return client.query(query, function(err, result) {
      if (err) {
        return console.error('ERROR with query', err);
      }
      console.log("YEAH QUERIED " + result.rows[0].clue);
      next(result);
      return client.end();
    });
  });
};

getRandomGame = function(next) {
  if (next == null) {
    next = function() {};
  }
  return getRandomGameId(function(gameId) {
    return getGame(gameId, next);
  });
};

module.exports = {
  getGame: getGame,
  getRandomGame: getRandomGame
};
