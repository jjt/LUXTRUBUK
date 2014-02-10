var Game, getGame, getRandomHash, _;

_ = require('lodash');

getGame = function(gamehash, next) {
  var gameKey, localGame;
  gameKey = "game-" + gamehash;
  localGame = localStorage.getItem(gameKey);
  if (localGame) {
    return next(JSON.parse(localGame));
  }
  return $.getJSON("/api/game/" + gamehash, function(data) {
    localStorage.setItem("game-" + gamehash, JSON.stringify(data));
    return next(data);
  });
};

getRandomHash = function(next) {
  return $.ajax({
    url: 'api/game/randomHash',
    success: function(data) {
      return next(data);
    }
  });
};

Game = (function() {
  function Game(clues) {
    _.chain(clues).groupBy(function(clue) {
      return clue.round;
    }).map(function(round) {
      return _.chain(round).groupBy(function(clue) {
        return clue.category;
      }).values().shuffle().value();
    }).tap(log).value();
  }

  return Game;

})();
