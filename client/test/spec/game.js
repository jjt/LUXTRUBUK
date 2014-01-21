delete require.cache[require.resolve('../../lib/game.js')];
var gL = gameLib = require('../../lib/game.js')();
var _ = require('lodash');
var prettyjson = require('prettyjson');
var fs = require('fs');

describe('Game', function () {
  var chai = require('chai');
  var expect = chai.expect;
  var assert = chai.assert;
  chai.should();

  var cluesJSON = function(err, next) {
    var path = __dirname + '/../data/Game.formatClues.input.json';
    fs.readFile(path, 'utf-8', function(err, data){
      if(err) throw err;
      next(null, JSON.parse(data));
    });
  } 

  it('should exist', function(){
    expect(gL).to.be.a('object');
  })

  //it('.formatClues() should transform flat clues into a heirarchy', function() {
    //cluesJSON(null, function(err, data) {
      //clues = Game.formatClues(JSON.parse(data)); 
      //fs.writeFile(__dirname + '/../data/Game.formatClues.out.json', JSON.stringify(clues));
    //});
  //});

  it('should have a sortToMiddle function', function() {
    assert.typeOf(gL.sortToMiddle, 'function'); 
  });

  it('.sortToMiddleByLen() sorts an array correctly', function() {
    var expected = ['a','ccc','eeeee','ggggggg','ffffff','dddd','bb'];
    assert.deepEqual(gL.sortToMiddle(_.shuffle(expected)), expected);
  });

  it('.cluesByRound() should get all clues of a given round', function() {
    cluesJSON(null, function(err, data) {
      if(err) throw err;
      var input = data;
      fs.readFile(__dirname + '/../data/Game.cluesByRound(1).json', function(err, data) {
        var expected = JSON.parse(data.toString()),
          actual = gL.cluesByRound(input, 1);
        assert.deepEqual(actual, expected);
      });
    }); 
  }); 

  it('instantiates a Game properly', function() {
    var gamehashSample = '54432a4cfd41aa5003ee2b6a19e53f9c';
    cluesJSON(null, function(err, data) {
      var game = new gL.Game(data);
      assert.equal(game.gamehash, gamehashSample);
    });
  });

  it('gets a clue and sets it as picked', function() {
    var cluehashSample = '7f85d75e691161b274f52f9cb09bf7c4',
      clueExpected = {
        "clue":"A pale shade of gray, or the powdery residue left after something is burned",
        "answer":"ash",
        "value":200,
        "category":"A GRAY AREA",
        "round":1,
        "cluehash":"7f85d75e691161b274f52f9cb09bf7c4",
        "gamehash":"54432a4cfd41aa5003ee2b6a19e53f9c",
        "picked":true};
    cluesJSON(null, function (err, data) {
      var game = new gL.Game(data);
      clue = game.pickClue(cluehashSample);
      assert.deepEqual(clue, clueExpected);
    });
  });

  it('gets clues by category group', function() {
    cluesJSON(null, function (err, data){
      var game = new gL.Game(data);
      game.start();
      var clues = game.curCluesByCat();
    });
  });

});
