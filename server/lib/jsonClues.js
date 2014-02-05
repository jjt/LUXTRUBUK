var api;

api = require('./api');

api.getGameHashes(null, function(err, hashes) {
  return console.log(hashes);
});

console.log(process.argv);
