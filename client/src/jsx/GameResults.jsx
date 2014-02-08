/** @jsx React.DOM */
module.exports = React.createClass({
  render: function(){
    return (
      <div className="GameResults">
        <h1>
          Thanks for playing!
        </h1>  
        <a href="#/game/new" data-route={true} className="newGame">New Game</a>
      </div>
    );
  }
});
