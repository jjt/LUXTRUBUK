/** @jsx React.DOM */
HomePage = React.createClass({
  render: function(){
    return(
      <div className="HomePage">
        <h1>LUXTRUBUK lets good pals simulate JEOPARDY!&trade; games locally in a
          modern browser.
        </h1>
        <p>
          There's no buzzing in to answer, so the first player or players to yell
          out the correct answer get points. If you yell out the wrong answer,
          you'll be deducted points. Be friends about the whole thing.
        </p> 
        <div className="newGameRow">
          <a href="#/game/new" data-route className="newGame">New Game</a>
        </div>
      </div>
    ); 
  } 
});

module.exports = HomePage;
