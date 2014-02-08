/** @jsx React.DOM */
module.exports = React.createClass({
  render: function(){
    return (
      React.DOM.div( {className:"GameResults"}, 
        React.DOM.h1(null, 
          " Thanks for playing! "
        ),  
        React.DOM.a( {href:"#/game/new", 'data-route':true, className:"newGame"}, "New Game")
      )
    );
  }
});
