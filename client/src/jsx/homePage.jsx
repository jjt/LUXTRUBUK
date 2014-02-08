/** @jsx React.DOM */
HomePage = React.createClass({
  render: function(){
    return(
      <div className="HomePage">
        <h3 className="HomePage__Blurb">LUXTRUBUK helps pals simulate JEOPARDY!&trade; games locally in a
          modern browser.
        </h3>
        <div className="newGameRow">
          <a href="#/game/new" data-route className="newGame">New Game</a>
        </div>
        <h3>How to play LUXTRUBUK</h3>
        <div className="HowToPlay">
          <div className="HowToPlay__Step">
            <img src="/img/how-to-play-1.png"/>
            <p>Pick a space from the gameboard to view a clue, and get ready to...</p>
          </div>
          <div className="HowToPlay__Step">
            <img src="/img/how-to-play-2.png"/>
            <p>Yell out the correct answer before one of your pals does</p>
          </div>
          <div className="HowToPlay__Step">
            <img src="/img/how-to-play-3.png"/>
            <p>Score any player who yelled out an answer &mdash; have fun, pals!</p>
          </div>
        </div>
      </div>
    ); 
  } 
});

module.exports = HomePage;
