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

var Clue = React.createClass({
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
      <div onClick={this.clueClick} className={clueClasses}>
        <span className={valueClasses}>${this.props.value}</span>
      </div>
    )
  }
});

var Category = React.createClass({
  clueClick: function(gamehash){
    this.props.clueClick(gamehash);
  },
  render: function() {
    var clueIndex = 1,
        clueComponents = _.map(this.props.clues, function(clue) {
          var value = this.props.round * (clueIndex++) * 200;
          return (<Clue key={clue.cluehash} picked={clue.picked}
            clueClick={this.clueClick} value={value} />);
        },this);
    return(
      <div className="Category">
        <div className="Category--title">
          <h4>{ this.props.key }</h4>
        </div>
        {clueComponents} 
      </div>
    );
  }
});

var PlayerBtn = React.createClass({
  render: function() {
    return(
      <div className="Player--group">
        <a className="PlayerBtn--wrong"><i className="icon-cancel"></i></a>
        <a className="PlayerBtn--right"><i className="icon-ok"></i></a>
      </div>  
    )
  }
});

var ClueDetail = React.createClass({
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
      return (<PlayerBtn player={player} />) 
    });
    return(
      <div className={cx({ClueDetail: true, hide: this.props.hide})}>
        <div className="ClueDetail--title">{this.props.clue.category}</div>
        <div className="ClueDetail--clue">{this.props.clue.clue}</div> 
        <div className="ClueDetail--answerHolder">
          <div className={cx({"ClueDetail--answer":true,
            show: this.props.showAnswer})}>{this.props.clue.answer}</div>
          <a className={cx({"ClueDetail--showAnswer":true,
            "hide":this.props.showAnswer})} onClick={this.showAnswer}>
            Show Answer</a> 
        </div>
        <div className="Controls">
          {playerBtns} 
          <div className="Player--group">
            <a onClick={this.close} className="ClueDetail--done">Done</a> 
          </div>
        </div>
      </div> 
    );
  }
});

var PlayerDisplay = React.createClass({
  render: function () {
    console.log(this.props);
    var className = "PlayerDisplay PlayerDisplay--" + this.props.key;
    return(
      <div className={className}>
        <h3>{this.props.name}: ${this.props.score}</h3>
      </div>
    );
  }
});

var PlayerBar = React.createClass({
  render: function() {
    var playerIndex = 1,
      players = _.map(this.props.players, function (score, name) {
        return(<PlayerDisplay key={playerIndex++} name={name} score={score}/>);
      })
    console.log(players);
    return(
      <div className="PlayerBar">
        {players}
        <div className="PlayerDisplay--dummy">
        </div>
      </div>  
    );
  }
});

var Game = React.createClass({
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
      <ClueDetail clue={clue} players={this.state.game.players} hide={false}
        key={clue.cluehash} onClueClose={this.onClueClose} />,
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
          return (<Category  key={categoryObj.cat} clues={categoryObj.clues}
            round={round} clueClick={clueClick} />);
        }),
        clueDetail = (<ClueDetail clue={this.state.clue}
            players={this.state.game.players} onClueClose={this.onClueClose}/>
        );
   
    return(
      <div className="Game">
        <div className="GameGrid">
          <div id="clueDetail"></div>
          {categoryComponents} 
        </div>
        <PlayerBar players={this.state.game.players} />
      </div>
    );
  }
});

var Luxtrubuk = React.createClass({
  render: function() {
    return(
      <Game game={this.props.game} />
    );
  }
});

module.exports = Game;
