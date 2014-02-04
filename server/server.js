var api, app, express, port;

express = require('express');

api = require('./lib/api');

app = express();

app.get('/api/game/randomHash', function(req, res) {
  return api.getRandomGameHash(null, function(err, hash) {
    return res.send(hash);
  });
});

app.get('/api/game/random', function(req, res) {
  return api.getRandomGameHash(null, function(err, hash) {
    return res.redirect("/api/game/" + hash);
  });
});

app.get('/api/game/:gamehash', function(req, res) {
  return api.getGame(null, req.params.gamehash, function(err, game) {
    return res.send(JSON.stringify(game));
  });
});

port = +process.env.PORT || 3000;

app.listen(port, function() {
  return console.log("LUXTRUBUK UP IN IT ON PORT " + port);
});
