var clientConnect, constring, getGame, getRandomGame, getRandomGameHash, pg, runQuery;

pg = require('pg');

constring = require('./config.LOCAL').constring;

clientConnect = function(next) {
  if (next == null) {
    next = function() {};
  }
  return pg.connect(constring, function(err, client, done) {
    if (err) {
      console.log("clientConnect ERROR");
      console.log(err);
      return next(err);
    }
    return next(err, client);
  });
};

runQuery = function(err, query, next) {
  if (next == null) {
    next = function() {};
  }
  return clientConnect(function(err, client) {
    return client.query(query, function(err, result) {
      if (err) {
        console.log(err);
        return next(err);
      }
      client.end();
      console.log("QUERY " + query);
      console.log("QUERY RESULTS " + (JSON.stringify(result.rows)));
      return next(err, result);
    });
  });
};

getGame = function(err, gamehash, next) {
  var fields, query;
  if (next == null) {
    next = function() {};
  }
  if (gamehash == null) {
    return;
  }
  fields = "clue, answer, value, category, round, cluehash";
  query = "SELECT " + fields + " FROM clues_flat WHERE gamehash='" + gamehash + "'    ORDER BY round, category, value";
  return runQuery(err, query, function(err, result) {
    if (err) {
      console.log("getGAME ERROR");
      console.log(err);
      return err;
    }
    return next(err, result.rows);
  });
};

getRandomGame = function(err, next) {
  if (next == null) {
    next = function() {};
  }
  return getRandomGameId(function(gameId) {
    return getGame(gameId, next);
  });
};

getRandomGameHash = function(err, next) {
  var offset, query;
  if (next == null) {
    next = function() {};
  }
  offset = "random() * (SELECT count(*) FROM clues_flat)";
  query = "SELECT gamehash FROM clues_flat OFFSET " + offset + " LIMIT 1";
  return runQuery(err, query, function(err, result) {
    console.log("gRGH: " + (JSON.stringify(result.rows)));
    return next(err, result.rows[0].gamehash);
  });
};

module.exports = {
  getGame: getGame,
  getRandomGame: getRandomGame,
  getRandomGameHash: getRandomGameHash
};
