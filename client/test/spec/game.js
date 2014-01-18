delete require.cache[require.resolve('../../lib/game.js')];
var Game = require('../../lib/game.js')();
var _ = require('lodash');

describe('Game', function () {
  var chai = require('chai');
  var expect = chai.expect;
  var assert = chai.assert;

  it('should exist', function(){
    expect(Game).to.be.a('object');
  })

  it('should have a formatClues function', function() {
    assert.typeOf(Game.formatClues, 'function');
  });

  it('should have a sortToMiddle function', function() {
    assert.typeOf(Game.sortToMiddle, 'function'); 
  });

  it('.sortToMiddleByLen() sorts an array correctly', function() {
    var expected = ['a','ccc','eeeee','ggggggg','ffffff','dddd','bb'];
    assert.deepEqual(Game.sortToMiddle(_.shuffle(expected)), expected);
  });

  
});
