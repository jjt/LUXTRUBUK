var app, express, getClues;

express = require('express');

getClues = require('./lib/getClues');

app = express();

app.get('/', function(req, res) {
  return getClues.getRandomGame(function(result) {
    return res.send(JSON.stringify(result));
  });
});

app.listen(3000);

console.log('LUXTRUBUK UP IN IT!');
