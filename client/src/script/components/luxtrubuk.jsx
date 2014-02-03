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

var ucFirst = function (str) {
  if(!_.isString(str))
    return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// ----------------------------------------------------------------------------
// PLAYER BAR & GAME STATUS
// ----------------------------------------------------------------------------

var PlayerDisplay = React.createClass({
  render: function () {
    var cxPlayerDisplay = cx({
      "PlayerDisplay": true
    , "red": this.props.score < 0
    , "PlayerDisplay--winner": this.props.winner
    });
    var cxIcon = cx({
      'icon-award': true
    , 'hide': !this.props.winner
    });
    return(
      <div className={cxPlayerDisplay}>
        <div className="title">
          <i className={cxIcon}></i>
          {this.props.name}
          <i className={cxIcon}></i>
          </div>
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
          score={score} winner={_.contains(this.props.winners, name)}/>);
      }, this)
    var round = this.props.round;
    if(round === 3) round = 'FINAL';
    if(round === 4) round = 'END';
    return(
      <div className={cx({
        PlayerBar: true
      , 'PlayerBar--gameover': this.props.round > 3
      , 'PlayerBar--winner': this.props.winner
      })}>
        {players}
        <div className="PlayerDisplay PlayerDisplay--round">
          <div className="title">Round</div>
          <p className="PlayerDisplay__score">{round}</p>
        </div>
      </div>
    );
  }
});


// ----------------------------------------------------------------------------
// GAME BOARD
// ----------------------------------------------------------------------------

var FinalRound = React.createClass({
  getInitialState: function () {
    return {
      bids: _.zipObject(this.props.playerKeys, [0,0,0])
    , hide: false
    } 
  }
, getPlayerInputComponents: function (argument) {
    return _.map(this.state.bids, function (value, key) {
      return(<FinalRoundBidInput key={key}
        onInputChange={this.onInputChange} value={value} />
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
    this.props.submitFinalBids(bids); 
    this.setState({hide: true});
  }
, render: function(){
    return(
      <form className={cx({FinalRound: true, hide: this.state.hide})} 
        onSubmit={this.onSubmit}
      >
        <h2>Final Round Category</h2>
        <h1>{this.props.clue.category}</h1>
        <div className="Controls">
          <div className="Control__group">
            <input type="text" ref={this.props.playerKeys[0]}
              placeholder="0"/>
          </div>
          <div className="Control__group">
            <input type="text" ref={this.props.playerKeys[1]}
              placeholder="0"/>
          </div>
          <div className="Control__group">
            <input type="text" ref={this.props.playerKeys[2]}
              placeholder="0"/>
          </div>
          <div className="Control__group">
            <button type="submit" className="btn">Bid</button>
          </div>
        </div>
      </form>
    )
  }
});

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
, getClueComponents: function () {
    return _.map(this.props.clues, function(clue, index) {
        var value = this.props.round * (index+1) * 200;
        return (<Clue key={clue.cluehash} picked={clue.picked}
          clueClick={this.clueClick} value={value} />);
    },this);
  }
, render: function() {
    var clueComponents = this.getClueComponents();
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
    if(this.props.finalBids)
      this.props.reportFinalAnswers(this.state.answers, this.props.finalBids);
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
            show: this.state.showAnswer})}>{ucFirst(this.props.clue.answer)}</div>
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
// GAME RESULTS
// ----------------------------------------------------------------------------
var GameResults = React.createClass({
  render: function(){
    return (
      <h1 className="GameResults">
        Thanks for playing!
      </h1>  
      <a className="btn" href="#/game/new">New Game</a>
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
    return(<FinalRound clue={this.state.clue}
        clueClick={this.clueClick} playerKeys={_.keys(this.state.players)}
        submitFinalBids={this.submitFinalBids} />
    );
  }
, getGameResultsComponent: function () {
    return(
      <GameResults winner={this.props.game.getLeaders()} />
    );
}
, getGameComponent: function() {
    if(this.state.round === 3)
      return this.getFinalRoundComponent();
    if(this.state.round === 4)
      return this.getGameResultsComponent();
    return _.map(this.state.clues, function(categoryObj) {
          return (<Category key={categoryObj.cat} clues={categoryObj.clues}
            round={this.state.round} clueClick={this.clueClick} />);
      }, this);
  }
, render: function() {
    var gameComponent = this.getGameComponent();
    return(
      <div className="Game">
        <div className={cx({GameGrid: true,
          'GameGrid--gameover': this.state.round === 4})}
        >
          <ClueDetail
            playerKeys={_.keys(this.state.players)}
            onClueClose={this.onClueClose}
            reportAnswers={this.reportAnswers}
            reportFinalAnswers={this.reportFinalAnswers}
            clue={this.state.clue}
            showClueDetail={this.state.showClueDetail}
            finalBids={this.state.finalBids}
          />
          {gameComponent} 
        </div>
        <PlayerBar players={this.state.players}
          round={this.state.round}
          winners={this.state.round < 4 ? [] : this.props.game.getLeaders()}
        />
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
