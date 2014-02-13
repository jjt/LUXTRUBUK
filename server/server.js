var app, config, dir, express, port, _;

express = require('express');

config = require('./lib/config')(process);

_ = require('lodash');

dir = process.cwd();

app = express();

app.get('/api/game/randomHash', function(req, res) {
  var cb, hash;
  cb = req.param('callback');
  hash = _.sample(require('./lib/gameHashes'));
  return res.send("" + cb + "(\"" + hash + "\")");
});

app.configure(function() {
  return app.use(express["static"](config.staticDir));
});

port = +process.env.PORT || 3000;

app.listen(port, function() {
  return console.log("LUXTRUBUK UP IN IT ON PORT " + port);
});
