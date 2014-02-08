/** @jsx React.DOM */

var cx = React.addons.classSet;

var ClueDetail = require('./ClueDetail.js');
var FinalRound = require('./FinalRound.js');
var Category = require('./Category.js');
var PlayerBar = require('./PlayerBar.js');

var Game = React.createClass({displayName: 'Game',
  getGameState: function() {
    return {
      players: this.props.game.getPlayers()
    , round: this.props.game.round()
    , clues: this.props.game.curCluesByCat()
    , finalBids: false
    }
  }
, getInitialState: function() {
    return _.merge(this.getGameState(), {
      clue: false
    , showClueDetail: false
    });
  }
, showClueDetail: function(clue) {
  }
, reportAnswers: function(results, value) {
    if(this.props.game.reportAnswers(results, value)) {
      this.setState(this.getInitialState());
    }
  }
, reportFinalAnswers: function(answers, bids) {
    this.props.game.reportFinalAnswers(answers, bids);
    this.setState(this.getInitialState())
  }
, clueClick: function(cluehash) {
    clue = this.props.game.pickClue(cluehash);
    this.setState({
      showClueDetail: true,
      clue: clue
    })
  }
, onClueClose: function() {
    var state = this.getInitialState();
    if(this.props.game.round() == 3)
      state.clue = state.clues[0].clues[0];
    this.setState(state);
  }
, submitFinalBids: function (bids) {
    this.setState({finalBids: bids, showClueDetail: true});
  }
, getFinalRoundComponent: function() {
    return(FinalRound( {clue:this.state.clue,
        clueClick:this.clueClick, playerKeys:_.keys(this.state.players),
        submitFinalBids:this.submitFinalBids} )
    );
  }
, getGameResultsComponent: function () {
    return(
      GameResults( {winner:this.props.game.getLeaders()} )
    );
}
, getGameComponent: function() {
    if(this.state.round === 3)
      return this.getFinalRoundComponent();
    if(this.state.round === 4)
      return this.getGameResultsComponent();
    return _.map(this.state.clues, function(categoryObj) {
          return (Category( {key:categoryObj.cat, clues:categoryObj.clues,
            round:this.state.round, clueClick:this.clueClick} ));
      }, this);
  }
, render: function() {
    var gameComponent = this.getGameComponent();
    return(
      React.DOM.div( {className:"Game"}, 
        React.DOM.div( {className:cx({GameGrid: true,
          'GameGrid--gameover': this.state.round === 4})}
        , 
          ClueDetail(
            {playerKeys:_.keys(this.state.players),
            onClueClose:this.onClueClose,
            reportAnswers:this.reportAnswers,
            reportFinalAnswers:this.reportFinalAnswers,
            clue:this.state.clue,
            showClueDetail:this.state.showClueDetail,
            finalBids:this.state.finalBids}
          ),
          gameComponent 
        ),
        PlayerBar( {players:this.state.players,
          round:this.state.round,
          winners:this.state.round < 4 ? [] : this.props.game.getLeaders()}
        )
      )
    );
  }
});

module.exports = Game;
