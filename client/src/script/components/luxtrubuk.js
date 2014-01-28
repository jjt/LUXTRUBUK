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
    return(
      React.DOM.div( {className:"PlayerBar"}, 
        players,
        React.DOM.div( {className:"PlayerDisplay PlayerDisplay--dummy"}, 
          React.DOM.h4(null, "Round"),
          React.DOM.p( {className:"PlayerDisplay__score"}, this.props.round)
        )
      )  
    );
  }
});


// ----------------------------------------------------------------------------
// GAME BOARD
// ----------------------------------------------------------------------------

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
, render: function() {
    var clueComponents = _.map(this.props.clues, function(clue, index) {
          console.log(index);
          var value = this.props.round * (index+1) * 200;
          return (Clue( {key:clue.cluehash, picked:clue.picked,
            clueClick:this.clueClick, value:value} ));
      },this);
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
    this.props.reportAnswers(this.state.answers, this.props.clue.value);
    this.props.onClueClose();
  }
, reportAnswer: function(player, answer) {
    this.state.answers[player] = answer;
    this.forceUpdate();
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
// MAIN GAME COMPONENT
// ----------------------------------------------------------------------------

var Game = React.createClass({displayName: 'Game',
  getGameState: function() {
    return {
      players: this.props.game.getPlayers()
    , round: this.props.game.round()
    , clues: this.props.game.curCluesByCat()
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
    console.log(results, value); 
    this.props.game.reportAnswers(results, value);
  }
, clueClick: function(cluehash) {
    clue = this.props.game.pickClue(cluehash);
    this.setState({
      showClueDetail: true,
      clue: clue
    })
  }
, onClueClose: function() {
    this.setState({players: this.props.game.getPlayers(), showClueDetail: false})
  }
, render: function() {
    var categoryComponents = _.map(this.state.clues, function(categoryObj) {
          return (Category( {key:categoryObj.cat, clues:categoryObj.clues,
            round:this.state.round, clueClick:this.clueClick} ));
      }, this);
    return(
      React.DOM.div( {className:"Game"}, 
        React.DOM.div( {className:"GameGrid"}, 
          ClueDetail(
            {playerKeys:_.keys(this.state.players),
            onClueClose:this.onClueClose,
            reportAnswers:this.reportAnswers,
            clue:this.state.clue,
            showClueDetail:this.state.showClueDetail}
          ),
          categoryComponents 
        ),
        PlayerBar( {players:this.state.players,
          round:this.props.game.round()} )
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
