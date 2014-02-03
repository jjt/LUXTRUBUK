/** @jsx React.DOM */

var cx = React.addons.classSet;

var log = function(){
  console.log("value"); 
  console.log.apply(console,_.toArray(arguments));
}

var hexStr = function() {
  return Math.random().toString(16).slice(2,10);
}

var gL = gameLib = require('../../../lib/game.js')();  



// ----------------------------------------------------------------------------
// PLAYER BAR & GAME STATUS
// ----------------------------------------------------------------------------

var PlayerDisplay = React.createClass({displayName: 'PlayerDisplay',
  render: function () {
    var className = "PlayerDisplay"
    className += this.props.score < 0 ? " red" : ""; 
    return(
      React.DOM.div( {className:className}, 
        React.DOM.h4(null, this.props.name),
        React.DOM.p( {className:"PlayerDisplay__score"}, "$",this.props.score)
      )
    );
  }
});

var PlayerBar = React.createClass({displayName: 'PlayerBar',
  render: function() {
    var playerIndex = 1,
      players = _.map(this.props.players, function (score, name) {
        return(PlayerDisplay( {key:playerIndex++, name:name,
          score:score}));
      })
    var round = this.props.round;
    if(round === 3) round = 'FINAL';
    if(round === 4) round = 'END';
    return(
      React.DOM.div( {className:"PlayerBar"}, 
        players,
        React.DOM.div( {className:"PlayerDisplay PlayerDisplay--dummy"}, 
          React.DOM.h4(null, "Round"),
          React.DOM.p( {className:"PlayerDisplay__score"}, round)
        )
      )
    );
  }
});


// ----------------------------------------------------------------------------
// GAME BOARD
// ----------------------------------------------------------------------------

var FinalRound = React.createClass({displayName: 'FinalRound',
  getInitialState: function () {
    return {
      bids: _.zipObject(this.props.playerKeys, [0,0,0])
    , hide: false
    } 
  }
, getPlayerInputComponents: function (argument) {
    return _.map(this.state.bids, function (value, key) {
      return(FinalRoundBidInput( {key:key,
        onInputChange:this.onInputChange, value:value} )
      );
    }, this);
  }
, onInputChange: function (key, value) {
    var newPlayerBids = this.state.bids;
    newPlayerBids[key] = value;
    this.setState({playerBids: newPlayerBids});
}
, onSubmit: function (ev) {
    ev.preventDefault();
    var bids = {}
    _.forEach(this.refs, function (ref, index) {
      bids[index] = +ref.getDOMNode().value;
    });
    console.log('FinalRound.onSubmit', bids);
    this.props.submitFinalBids(bids); 
    this.setState({hide: true});
  }
, render: function(){
    return(
      React.DOM.form( {className:cx({FinalRound: true, hide: this.state.hide}), 
        onSubmit:this.onSubmit}
      , 
        React.DOM.h1(null, this.props.clue.category),
        React.DOM.div( {className:"Controls"}, 
          React.DOM.div( {className:"Control__group"}, 
            React.DOM.input( {type:"text", ref:this.props.playerKeys[0]})
          ),
          React.DOM.div( {className:"Control__group"}, 
            React.DOM.input( {type:"text", ref:this.props.playerKeys[1]})
          ),
          React.DOM.div( {className:"Control__group"}, 
            React.DOM.input( {type:"text", ref:this.props.playerKeys[2]})
          ),
          React.DOM.div( {className:"Control__group"}, 
            React.DOM.button( {type:"submit", className:"btn"}, "Bid")
          )
        )
      )
    )
  }
});

var Clue = React.createClass({displayName: 'Clue',
  getInitialState: function() {
    return {
      picked: this.props.picked
    }
  }
, clueClick: function(){
    if(this.state.picked)
      return;
    this.props.clueClick(this.props.key);
    this.setState({picked: true});
  }
, render: function(){
    var clueClasses = cx({
          'Clue': true,
          'Clue--picked':this.state.picked
        })
      , valueClasses = cx({
          'Clue__value': true,
          'fourDigit': this.props.value/1000 >= 1
        });
    return(
      React.DOM.div( {onClick:this.clueClick, className:clueClasses}, 
        React.DOM.span( {className:valueClasses}, "$",this.props.value)
      )
    )
  }
});

var Category = React.createClass({displayName: 'Category',
  clueClick: function(clueHash){
    this.props.clueClick(clueHash);
  }
, getClueComponents: function () {
    return _.map(this.props.clues, function(clue, index) {
        var value = this.props.round * (index+1) * 200;
        return (Clue( {key:clue.cluehash, picked:clue.picked,
          clueClick:this.clueClick, value:value} ));
    },this);
  }
, render: function() {
    var clueComponents = this.getClueComponents();
    return(
      React.DOM.div( {className:"Category"}, 
        React.DOM.div( {className:"Category__title"}, 
          React.DOM.h4(null,  this.props.key )
        ),
        clueComponents 
      )
    );
  }
});

// ----------------------------------------------------------------------------
// CLUE DETAIL
// ----------------------------------------------------------------------------

var PlayerAnswerBtns = React.createClass({displayName: 'PlayerAnswerBtns',
  clickHandler: function(ansKey) {
    return function() {
      if(this.props.disabled)
        return;
      if(this.props.answer === ansKey)
        ansKey = false;
      this.reportAnswer(ansKey);
    }.bind(this)
  }
, reportAnswer: function(answer) {
    return this.props.reportAnswer(this.props.key, answer);
  }
, render: function() {
    return(
      React.DOM.div( {className:"Player__group"}, 
        React.DOM.i(
          {onClick:this.clickHandler('wrong'),
          disabled:this.props.disabled ? '' : null,
          className:cx({
            AnswerBtn__wrong: true,
            'icon-cancel': true,
            'selected': this.props.answer === 'wrong',
            'btn-disabled': this.props.disabled,
            'btn-error': this.props.answer === 'wrong'})}
        ),
        React.DOM.i(
          {onClick:this.clickHandler('right'),
          disabled:this.props.disabled ? '' : null,
          className:cx({
            AnswerBtn__right: true,
            'icon-ok': true,
            'selected': this.props.answer === 'right',
            'btn-disabled': this.props.disabled,
            'btn-success': this.props.answer === 'right'})}
        )
      ) 
    )
  }
});

var ClueDetail = React.createClass({displayName: 'ClueDetail',
  getInitialState: function() {
    return {
      showAnswer: false
    , answers: _.zipObject(this.props.playerKeys, [false, false, false])
    }
  }
, getDefaultProps: function () {
    return {
      clue: {}
    } 
  }
, componentWillReceiveProps: function(nextprops) {
    this.setState(this.getInitialState()); 
  }

, showAnswer: function() {
    this.setState({showAnswer: true});
  }
, submit: function(ev) { 
    if(this.props.finalBids) {
      this.props.reportFinalAnswers(this.state.answers, this.props.finalBids);
    }
    else
      this.props.reportAnswers(this.state.answers, this.props.clue.value);
    this.props.onClueClose();
  }
, reportAnswer: function(player, answer) {
    var newState = this.state;
    newState.answers[player] = answer;
    this.setState(newState);
  }
, getAnsBtnComponents: function() {
    return _.map(this.state.answers, function(answer, name) {
      return (PlayerAnswerBtns( {player:name, reportAnswer:this.reportAnswer,
        key:name, answer:answer, disabled:!this.state.showAnswer} )
      ) 
    }, this);
  }
, render: function () {
    return(
      React.DOM.div( {className:cx({ClueDetail: true, hide: !this.props.showClueDetail})}, 
        React.DOM.div( {className:"ClueDetail__title"}, this.props.clue.category),
        React.DOM.div( {className:"ClueDetail__clue"}, this.props.clue.clue),
        React.DOM.div( {className:"ClueDetail__answerHolder"}, 
          React.DOM.div( {className:cx({"ClueDetail__answer":true,
            show: this.state.showAnswer})}, this.props.clue.answer),
          React.DOM.a( {className:cx({"ClueDetail__showAnswer":true,
            hide:this.state.showAnswer}), onClick:this.showAnswer}, 
            " Show Answer") 
        ),
        React.DOM.div( {className:"Controls"}, 
          this.getAnsBtnComponents(), 
          React.DOM.div( {className:"Player__group"}, 
            React.DOM.a( {disabled:this.state.showAnswer ? null: 'disabled',
              onClick:this.submit,
              className:cx({
                ClueDetail__done: true,
                'btn-disabled': this.state.disabled
              })}
            , 
              " Done "
            ) 
          )
        )
      ) 
    );
  }
});


// ----------------------------------------------------------------------------
// GAME RESULTS
// ----------------------------------------------------------------------------
var GameResults = React.createClass({displayName: 'GameResults',
  render: function(){
    return (
      React.DOM.h2( {className:"GameResults"}, 
        this.props.winner, " is the winner! "
      )  
    );
  }
});



// ----------------------------------------------------------------------------
// MAIN GAME COMPONENT
// ----------------------------------------------------------------------------

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
    var state = this.getGameState();
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
      GameResults( {winner:this.props.game.getLeader()} )
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
        React.DOM.div( {className:"GameGrid"}, 
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
          round:this.state.round} )
      )
    );
  }
});

var Luxtrubuk = React.createClass({displayName: 'Luxtrubuk',
  render: function() {
    return(
      Game( {game:this.props.game} )
    );
  }
});

module.exports = Game;
