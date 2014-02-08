/** @jsx React.DOM */
HomePage = React.createClass({
  render: function(){
    return(
      React.DOM.div( {className:"HomePage"}, 
        React.DOM.h1(null, "LUXTRUBUK helps pals to simulate JEOPARDY!™ games locally in a "+
          "modern browser. "
        ),
        React.DOM.div( {className:"flexGrid"}, 
          React.DOM.div( {className:"homeStep"}, 
            React.DOM.img( {src:"/img/how-to-play-1.png"}),
            React.DOM.p(null, "Pick a space from the gameboard to view a clue, and get ready to...")
          ),
          React.DOM.div( {className:"homeStep"}, 
            React.DOM.img( {src:"/img/how-to-play-2.png"}),
            React.DOM.p(null, "Yell out the correct answer before one of your pals does")
          ),
          React.DOM.div( {className:"homeStep"}, 
            React.DOM.img( {src:"/img/how-to-play-3.png"}),
            React.DOM.p(null, "Score any player who yelled out an answer — have fun, pals!")
          )
        ),
        React.DOM.div( {className:"newGameRow"}, 
          React.DOM.a( {href:"#/game/new", 'data-route':true, className:"newGame"}, "New Game")
        )
      )
    ); 
  } 
});

module.exports = HomePage;
