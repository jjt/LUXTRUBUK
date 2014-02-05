var app, dir, express, port, _;

express = require('express');

_ = require('lodash');

dir = process.cwd();

app = express();

console.log(dir);

app.get('/api/game/randomHash', function(req, res) {
  return res.send(_.sample(require('./lib/gameHashes')));
});

app.configure(function() {
  return app.use(express["static"]("" + dir + "/client/public"));
});

port = +process.env.PORT || 3000;

app.listen(port, function() {
  return console.log("LUXTRUBUK UP IN IT ON PORT " + port);
});
