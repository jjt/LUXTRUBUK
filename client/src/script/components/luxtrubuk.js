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

var Clue = React.createClass({displayName: 'Clue',
  getInitialState: function() {
    return {
      picked: this.props.picked
    }
  },
  clueClick: function(){
    if(this.state.picked)
      return;
    this.props.clueClick(this.props.key);
    this.setState({picked: true});
  },
  render: function(){
    var clueClasses = cx({
          'Clue': true,
          'Clue--picked':this.state.picked
        })
      , valueClasses = cx({
          'Clue--value': true,
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
  clueClick: function(gamehash){
    this.props.clueClick(gamehash);
  },
  render: function() {
    var clueIndex = 1,
        clueComponents = _.map(this.props.clues, function(clue) {
          var value = this.props.round * (clueIndex++) * 200;
          return (Clue( {key:clue.cluehash, picked:clue.picked,
            clueClick:this.clueClick, value:value} ));
        },this);
    return(
      React.DOM.div( {className:"Category"}, 
        React.DOM.div( {className:"Category--title"}, 
          React.DOM.h4(null,  this.props.key )
        ),
        clueComponents 
      )
    );
  }
});

var PlayerBtn = React.createClass({displayName: 'PlayerBtn',
  render: function() {
    return(
      React.DOM.div( {className:"Player--group"}, 
        React.DOM.a( {className:"PlayerBtn--wrong"}, React.DOM.i( {className:"icon-cancel"})),
        React.DOM.a( {className:"PlayerBtn--right"}, React.DOM.i( {className:"icon-ok"}))
      )  
    )
  }
});

var ClueDetail = React.createClass({displayName: 'ClueDetail',
  showAnswer: function() {
    this.setProps({showAnswer: true});
  },
  close: function() {
    this.setProps({hide:true});
    console.log(this.props);
    this.props.onClueClose();
  },
  render: function () {
    var playerBtns = _.map(this.props.players, function(player){
      return (PlayerBtn( {player:player} )) 
    });
    return(
      React.DOM.div( {className:cx({ClueDetail: true, hide: this.props.hide})}, 
        React.DOM.div( {className:"ClueDetail--title"}, this.props.clue.category),
        React.DOM.div( {className:"ClueDetail--clue"}, this.props.clue.clue), 
        React.DOM.div( {className:"ClueDetail--answerHolder"}, 
          React.DOM.div( {className:cx({"ClueDetail--answer":true,
            show: this.props.showAnswer})}, this.props.clue.answer),
          React.DOM.a( {className:cx({"ClueDetail--showAnswer":true,
            "hide":this.props.showAnswer}), onClick:this.showAnswer}, 
            " Show Answer") 
        ),
        React.DOM.div( {className:"Controls"}, 
          playerBtns, 
          React.DOM.div( {className:"Player--group"}, 
            React.DOM.a( {onClick:this.close, className:"ClueDetail--done"}, "Done") 
          )
        )
      ) 
    );
  }
});

var PlayerDisplay = React.createClass({displayName: 'PlayerDisplay',
  render: function () {
    console.log(this.props);
    var className = "PlayerDisplay PlayerDisplay--" + this.props.key;
    return(
      React.DOM.div( {className:className}, 
        React.DOM.h3(null, this.props.name,": $",this.props.score)
      )
    );
  }
});

var PlayerBar = React.createClass({displayName: 'PlayerBar',
  render: function() {
    var playerIndex = 1,
      players = _.map(this.props.players, function (score, name) {
        return(PlayerDisplay( {key:playerIndex++, name:name, score:score}));
      })
    console.log(players);
    return(
      React.DOM.div( {className:"PlayerBar"}, 
        players,
        React.DOM.div( {className:"PlayerDisplay--dummy"}
        )
      )  
    );
  }
});

var Game = React.createClass({displayName: 'Game',
  getInitialState: function() {
    return {
      game: this.props.game,
      clue: this.props.game.getClue(),
      showClue: false,
      cat: null
    }
  },
  showClue: function(clue) {
    React.renderComponent(
      ClueDetail( {clue:clue, players:this.state.game.players, hide:false,
        key:clue.cluehash, onClueClose:this.onClueClose} ),
      document.getElementById('clueDetail')
    );
  },
  clueClick: function(cluehash) {
    clue = this.state.game.pickClue(cluehash);
    this.showClue(clue);
  },
  onClueClose: function() {
    console.log('onClueClose');
    var needsUpdate = this.state.game.updateGame();
    if(needsUpdate)
      this.forceUpdate();
  },
  render: function() {
    console.log(this.state.game.curCluesByCat());
    var index = 1,
        clues = this.state.game.curCluesByCat(),
        round = this.state.game.round(),
        clueClick = this.clueClick,
        categoryComponents = _.map(clues, function(categoryObj) {
          //return (<Category clues={categoryObj.clues} key={categoryObj.cat}
            //valueClick={this.valueClick} round={round} />);
          return (Category(  {key:categoryObj.cat, clues:categoryObj.clues,
            round:round, clueClick:clueClick} ));
        }),
        clueDetail = (ClueDetail( {clue:this.state.clue,
            players:this.state.game.players, onClueClose:this.onClueClose})
        );
   
    return(
      React.DOM.div( {className:"Game"}, 
        React.DOM.div( {className:"GameGrid"}, 
          React.DOM.div( {id:"clueDetail"}),
          categoryComponents 
        ),
        PlayerBar( {players:this.state.game.players} )
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
