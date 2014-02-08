/** @jsx React.DOM */
HomePage = React.createClass({
  render: function(){
    return(
      React.DOM.div( {className:"HomePage"}, 
        React.DOM.h3( {className:"HomePage__Blurb"}, "LUXTRUBUK helps pals simulate JEOPARDY!™ games locally in a "+
          "modern browser. "
        ),
        React.DOM.div( {className:"newGameRow"}, 
          React.DOM.a( {href:"#/game/new", 'data-route':true, className:"newGame"}, "New Game")
        ),
        React.DOM.h3(null, "How to play LUXTRUBUK"),
        React.DOM.div( {className:"HowToPlay"}, 
          React.DOM.div( {className:"HowToPlay__Step"}, 
            React.DOM.img( {src:"/img/how-to-play-1.png"}),
            React.DOM.p(null, "Pick a space from the gameboard to view a clue, and get ready to...")
          ),
          React.DOM.div( {className:"HowToPlay__Step"}, 
            React.DOM.img( {src:"/img/how-to-play-2.png"}),
            React.DOM.p(null, "Yell out the correct answer before one of your pals does")
          ),
          React.DOM.div( {className:"HowToPlay__Step"}, 
            React.DOM.img( {src:"/img/how-to-play-3.png"}),
            React.DOM.p(null, "Score any player who yelled out an answer — have fun, pals!")
          )
        )
      )
    ); 
  } 
});

module.exports = HomePage;
