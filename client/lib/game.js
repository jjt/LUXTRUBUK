var Game, cluesByCategory, cluesByRound, defaultPlayers, getClues, getRandomHash, log, sortCatGroup, sortToMiddle, sortToMiddleByLen, ucFirst, _,
  __hasProp = {}.hasOwnProperty;

_ = require('lodash');

log = function(msg) {
  return console.log.call(console, msg);
};

getClues = function(gamehash, next) {
  var gameKey, localGame;
  gameKey = "game-" + gamehash;
  localGame = localStorage.getItem(gameKey);
  if (localGame) {
    return next(JSON.parse(localGame));
  }
  return $.getJSON("/data/games/" + gamehash + ".json", function(data) {
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

sortToMiddle = function(arr, sortByFn) {
  var head, out, sorted, tail;
  if (sortByFn == null) {
    sortByFn = _.identity;
  }
  sorted = _.sortBy(arr, sortByFn);
  head = _.filter(sorted, function(el, index, arr) {
    return (index % 2) === 0;
  });
  tail = _.difference(sorted, head).reverse();
  out = head.concat(tail);
  return out;
};

sortToMiddleByLen = function(arr) {
  return sortToMiddle(arr, function(item) {
    return item.length;
  });
};

sortCatGroup = function(arr) {
  return arr = sortToMiddle(arr, function(item) {
    return item.cat.length;
  });
};

cluesByRound = function(clues, roundNum) {
  return _.filter(clues, {
    'round': roundNum
  });
};

cluesByCategory = function(clues, category) {
  return _.filter(clues, {
    'category': category
  });
};

ucFirst = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

defaultPlayers = function() {
  return {
    Hortence: 0,
    Edmund: 0,
    Aloisius: 0
  };
};

Game = (function() {
  function Game(clues, players) {
    this.clues = clues;
    this.players = players != null ? players : defaultPlayers();
    this.gamehash = this.clues[0].gamehash;
    this._round = 0;
    return this;
  }

  Game.prototype.getClue = function(cluehash) {
    var clue;
    if (cluehash == null) {
      return this.clues[0];
    }
    clue = _.find(this.clues, {
      cluehash: cluehash
    });
    return clue;
  };

  Game.prototype.pickClue = function(cluehash) {
    var clue;
    clue = this.getClue(cluehash);
    clue.picked = true;
    return clue;
  };

  Game.prototype.curClues = function() {
    return cluesByRound(this.clues, this._round);
  };

  Game.prototype.curCluesByCat = function() {
    var a, clues;
    clues = this.curClues();
    return a = _.chain(clues).groupBy('category').mapValues(function(v, k) {
      return {
        cat: k,
        clues: v
      };
    }).toArray().tap(sortCatGroup).valueOf();
  };

  Game.prototype.updateGame = function() {
    var cluesLeft;
    cluesLeft = _.filter(this.curClues(), {
      picked: void 0
    }).length;
    if (cluesLeft <= 0) {
      this._round++;
      return true;
    }
    return false;
  };

  Game.prototype.getPlayers = function() {
    return this.players;
  };

  Game.prototype.playerResult = function(player, answer, value) {
    if (!answer) {
      return;
    }
    return this.players[player] += value * (answer === 'right' ? 1 : -1);
  };

  Game.prototype.reportAnswers = function(results, value) {
    var k, v;
    for (k in results) {
      if (!__hasProp.call(results, k)) continue;
      v = results[k];
      this.playerResult(k, v, value);
    }
    return this.updateGame();
  };

  Game.prototype.reportFinalAnswers = function(answers, bids) {
    var k, v;
    for (k in answers) {
      if (!__hasProp.call(answers, k)) continue;
      v = answers[k];
      this.playerResult(k, v, bids[k]);
    }
    this.round(4);
    return true;
  };

  Game.prototype.getTopScore = function() {
    var topScoreFn;
    topScoreFn = function(acc, val, key) {
      if (val > acc) {
        return val;
      } else {
        return acc;
      }
    };
    return _.reduce(this.players, topScoreFn, 0);
  };

  Game.prototype.getLeaders = function() {
    var topScore;
    topScore = this.getTopScore();
    return _.chain(this.players).pairs().filter(function(pair) {
      return pair[1] === topScore;
    }).map(function(pair) {
      return pair[0];
    }).value();
  };

  Game.prototype.start = function() {
    return this._round = 1;
  };

  Game.prototype.round = function(round) {
    if (round) {
      this._round = round;
    }
    return this._round;
  };

  return Game;

})();

module.exports = function() {
  return {
    sortToMiddle: sortToMiddle,
    getRandomHash: getRandomHash,
    getClues: getClues,
    sortToMiddleByLen: sortToMiddleByLen,
    cluesByRound: cluesByRound,
    Game: Game
  };
};
