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
          'Clue__value': true,
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
        <div className="Category__title">
          <h4>{ this.props.key }</h4>
        </div>
        {clueComponents} 
      </div>
    );
  }
});

var PlayerBtn = React.createClass({
  render: function() {
    var disabled = this.props.disabled ? 'disabled' : '';
    return(
      <div className="Player__group">
        <a disabled={disabled ? true : null} className={cx({PlayerBtn__wrong: true,
          'btn-disabled': this.props.disabled})}>
          <i className="icon-cancel"></i>
        </a>
        <a disabled={disabled ? true : null} className={cx({PlayerBtn__right: true,
          'btn-disabled': this.props.disabled})}>
          <i className="icon-ok"></i>
        </a>
      </div>  
    )
  }
});

var ClueDetail = React.createClass({
  showAnswer: function() {
    this.setProps({showAnswer: true});
  },
  close: function(ev) {
    console.log(ev);
    this.setProps({hide:true});
    console.log(this.props);
    this.props.onClueClose();
  },
  render: function () {
    var disabled = this.props.showAnswer == null || this.props.showAnswer == false;
    var playerBtns = _.map(this.props.players, function(player){
      return (<PlayerBtn player={player} disabled={disabled}/>) 
    });
    return(
      <div className={cx({ClueDetail: true, hide: this.props.hide})}>
        <div className="ClueDetail__title">{this.props.clue.category}</div>
        <div className="ClueDetail__clue">{this.props.clue.clue}</div>
        <div className="ClueDetail__answerHolder">
          <div className={cx({"ClueDetail__answer":true,
            show: this.props.showAnswer})}>{this.props.clue.answer}</div>
          <a className={cx({"ClueDetail__showAnswer":true,
            "hide":this.props.showAnswer})} onClick={this.showAnswer}>
            Show Answer</a> 
        </div>
        <div className="Controls">
          {playerBtns} 
          <div className="Player__group">
            <a disabled={disabled ? 'disabled' : null} onClick={this.close}
              className={cx({ClueDetail__done: true, 'btn-disabled': disabled})}>
              Done
            </a> 
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
        <h4>{this.props.name}</h4>
        <p className="PlayerDisplay__score">${this.props.score}</p>
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
        <div className="PlayerDisplay PlayerDisplay--dummy">
          <h4>Round</h4>
          <p className="PlayerDisplay__score">{this.props.round}</p>
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
        <PlayerBar players={this.state.game.players} round={round} />
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
