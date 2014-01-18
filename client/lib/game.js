var formatClues, getClues, getRandomHash, sortToMiddle, sortToMiddleByLen, _;

_ = require('lodash');

getClues = function(gamehash, next) {
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

sortToMiddleByLen = function(array) {
  return sortToMiddle(array, function(a, b) {
    if (a.length < b.length) {
      -1;
    }
    if (a.length > b.length) {
      1;
    }
    return 0;
  });
};

sortToMiddle = function(array, sortFn) {
  var head, sorted, tail;
  if (sortFn == null) {
    sortFn = function(a, b) {
      if (a < b) {
        return -1;
      } else {
        return 1;
      }
    };
  }
  sorted = array.sort(sortFn);
  head = _.filter(sorted, function(el, index, arr) {
    return (index % 2) === 0;
  });
  tail = _.difference(sorted, head).reverse();
  return head.concat(tail);
};

formatClues = function(clues) {
  return _.chain(clues).groupBy(function(clue) {
    return clue.round;
  }).map(function(round) {
    return _.chain(round).groupBy(function(clue) {
      return clue.category;
    }).values().sortToMiddle().value();
  }).tap(log).value();
};

module.exports = function() {
  return {
    formatClues: formatClues,
    sortToMiddle: sortToMiddle,
    getRandomHash: getRandomHash,
    getClues: getClues,
    sortToMiddleByLen: sortToMiddleByLen
  };
};
