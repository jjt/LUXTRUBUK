/** @jsx React.DOM */
HomePage = React.createClass({
  render: function(){
    return(
      <h1>LUXTRUBUK lets good pals simulate JEOPARDY!&trade; games locally in a
        modern browser.
      </h1>
      <p className="gamma">
        There are no buzzers to ring in, so the first player or players to yell
        out the correct answer get points. If you yell out the wrong answer,
        you'll be deducted points.
      </p>
        
      <p>If you want to get fancy, grab some pots and pans or bells
        or something.
      </p>
      <div className="newGameRow">
        <a href="#/game/new" data-route class="newGame">New Game</a>
      </div>
      
    ); 
  } 
});

module.exports = HomePage;
