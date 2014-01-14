var api, app, express;

express = require('express');

api = require('./lib/api');

app = express();

app.get('/api/game/new', function(req, res) {
  return api.getRandomGameHash(null, function(err, hash) {
    return res.redirect("/game/" + hash);
  });
});

app.get('/api/game/:gamehash', function(req, res) {
  return api.getGame(null, req.params.gamehash, function(err, game) {
    return res.send(JSON.stringify(game));
  });
});

app.listen(3000);

console.log('LUXTRUBUK UP IN IT!');
