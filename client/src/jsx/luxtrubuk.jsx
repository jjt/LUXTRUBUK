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

var PlayerDisplay = React.createClass({
  render: function () {
    var className = "PlayerDisplay"
    className += this.props.score < 0 ? " red" : ""; 
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
        return(<PlayerDisplay key={playerIndex++} name={name}
          score={score}/>);
      })
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


// ----------------------------------------------------------------------------
// GAME BOARD
// ----------------------------------------------------------------------------

var Clue = React.createClass({
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
      <div onClick={this.clueClick} className={clueClasses}>
        <span className={valueClasses}>${this.props.value}</span>
      </div>
    )
  }
});

var Category = React.createClass({
  clueClick: function(clueHash){
    this.props.clueClick(clueHash);
  }
, render: function() {
    var clueComponents = _.map(this.props.clues, function(clue, index) {
          console.log(index);
          var value = this.props.round * (index+1) * 200;
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

// ----------------------------------------------------------------------------
// CLUE DETAIL
// ----------------------------------------------------------------------------

var PlayerAnswerBtns = React.createClass({
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
      <div className="Player__group">
        <i
          onClick={this.clickHandler('wrong')}
          disabled={this.props.disabled ? '' : null}
          className={cx({
            AnswerBtn__wrong: true,
            'icon-cancel': true,
            'selected': this.props.answer === 'wrong',
            'btn-disabled': this.props.disabled,
            'btn-error': this.props.answer === 'wrong'})}
        ></i>
        <i
          onClick={this.clickHandler('right')}
          disabled={this.props.disabled ? '' : null}
          className={cx({
            AnswerBtn__right: true,
            'icon-ok': true,
            'selected': this.props.answer === 'right',
            'btn-disabled': this.props.disabled,
            'btn-success': this.props.answer === 'right'})}
        ></i>
      </div> 
    )
  }
});

var ClueDetail = React.createClass({
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
      return (<PlayerAnswerBtns player={name} reportAnswer={this.reportAnswer}
        key={name} answer={answer} disabled={!this.state.showAnswer} />
      ) 
    }, this);
}
, render: function () {
    return(
      <div className={cx({ClueDetail: true, hide: !this.props.showClueDetail})}>
        <div className="ClueDetail__title">{this.props.clue.category}</div>
        <div className="ClueDetail__clue">{this.props.clue.clue}</div>
        <div className="ClueDetail__answerHolder">
          <div className={cx({"ClueDetail__answer":true,
            show: this.state.showAnswer})}>{this.props.clue.answer}</div>
          <a className={cx({"ClueDetail__showAnswer":true,
            hide:this.state.showAnswer})} onClick={this.showAnswer}>
            Show Answer</a> 
        </div>
        <div className="Controls">
          {this.getAnsBtnComponents()} 
          <div className="Player__group">
            <a disabled={this.state.showAnswer ? null: 'disabled'}
              onClick={this.submit}
              className={cx({
                ClueDetail__done: true,
                'btn-disabled': this.state.disabled
              })}
            >
              Done
            </a> 
          </div>
        </div>
      </div> 
    );
  }
});





// ----------------------------------------------------------------------------
// MAIN GAME COMPONENT
// ----------------------------------------------------------------------------

var Game = React.createClass({
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
          return (<Category key={categoryObj.cat} clues={categoryObj.clues}
            round={this.state.round} clueClick={this.clueClick} />);
      }, this);
    return(
      <div className="Game">
        <div className="GameGrid">
          <ClueDetail
            playerKeys={_.keys(this.state.players)}
            onClueClose={this.onClueClose}
            reportAnswers={this.reportAnswers}
            clue={this.state.clue}
            showClueDetail={this.state.showClueDetail}
          />
          {categoryComponents} 
        </div>
        <PlayerBar players={this.state.players}
          round={this.props.game.round()} />
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
