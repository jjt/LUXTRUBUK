/** @jsx React.DOM */
var cx = React.addons.classSet;
var PlayerDisplay = require('./PlayerDisplay.js');
module.exports = React.createClass({
  render: function() {
    var playerIndex = 1,
      players = _.map(this.props.players, function (score, name) {
        return(PlayerDisplay( {key:playerIndex++, name:name,
          score:score, winner:_.contains(this.props.winners, name)}));
      }, this)
    var round = this.props.round;
    if(round === 3) round = 'FINAL';
    if(round === 4) round = 'END';
    return(
      React.DOM.div( {className:cx({
        PlayerBar: true
      , 'PlayerBar--gameover': this.props.round > 3
      , 'PlayerBar--winner': this.props.winner
      })}, 
        players,
        React.DOM.div( {className:"PlayerDisplay PlayerDisplay--round"}, 
          React.DOM.div( {className:"title"}, "Round"),
          React.DOM.p( {className:"PlayerDisplay__score"}, round)
        )
      )
    );
  }
});

