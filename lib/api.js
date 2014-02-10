var Promise, clientConnect, constring, getAllClues, getGame, getGameHashes, getRandomGame, getRandomGameHash, pg, runQuery;

pg = require('pg');

Promise = require('bluebird');

constring = require('./config.LOCAL').constring;

pg.defaults.poolSize = 2;

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
    return next(err, client, done);
  });
};

runQuery = function(err, query, next) {
  if (next == null) {
    next = function() {};
  }
  return clientConnect(function(err, client, done) {
    return client.query(query, function(err, result) {
      if (err) {
        console.log(err);
        return next(err);
      }
      client.end();
      done(1);
      return next(err, result);
    });
  });
};

getAllClues = function(err, next) {
  var fields, query;
  if (next == null) {
    next = function() {};
  }
  fields = "clue, answer, value, category, round, cluehash";
  query = "SELECT " + fields + " FROM clues_flat ORDER BY round, category, value";
  return runQuery(err, query, function(err, result) {
    return next(err, result != null ? result.rows : void 0);
  });
};

getGameHashes = function(err, next) {
  var query;
  if (next == null) {
    next = function() {};
  }
  query = "select gamehash from clues_flat group by gamehash order by gamehash";
  return runQuery(err, query, function(err, result) {
    return next(err, result != null ? result.rows.map(function(obj) {
      return obj.gamehash;
    }) : void 0);
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
  query = "SELECT " + fields + " FROM clues_flat WHERE gamehash='" + gamehash + "' ORDER BY round, category, value";
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
    return next(err, result.rows[0].gamehash);
  });
};

module.exports = {
  getGame: getGame,
  getRandomGame: getRandomGame,
  getRandomGameHash: getRandomGameHash,
  getGameHashes: getGameHashes,
  getAllClues: getAllClues
};
