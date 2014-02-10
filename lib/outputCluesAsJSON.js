var api, async, fs, main, makeGameFile, makeGameFiles, outputHashesModule;

async = require('async');

api = require('./api');

fs = require('fs');

outputHashesModule = function(err, next) {
  if (next == null) {
    next = function() {};
  }
  return api.getGameHashes(null, function(err, hashes) {
    var file;
    if (err != null) {
      throw err;
    }
    file = 'gameHashes.coffee';
    return fs.writeFile(file, "module.exports = " + JSON.stringify(hashes), function(err) {
      if (err != null) {
        throw err;
      }
      console.log('Saved gamehashes file successfully!', file);
      return next(hashes);
    });
  });
};

makeGameFile = function(hash, next) {
  return api.getGame(null, hash, function(err, clues) {
    var file;
    file = __dirname + ("/../../../../client/public/data/games/" + hash + ".json");
    return fs.writeFile(file, JSON.stringify(clues), function(err) {
      if (err != null) {
        throw err;
      }
      console.log("Saved game " + hash);
      return next();
    });
  });
};

makeGameFiles = function(hashes) {
  console.log(hashes.length);
  return hashes.forEach(makeGameFile);
};

main = function() {
  return outputHashesModule(null, function(hashes) {
    var hashFns;
    hashFns = hashes.map(function(hash) {
      return function(cb) {
        return makeGameFile(hash, cb);
      };
    });
    return async.series(hashFns);
  });
};

main();
