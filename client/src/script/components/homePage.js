/** @jsx React.DOM */
HomePage = React.createClass({
  render: function(){
    return(
      React.DOM.div( {className:"HomePage"}, 
        React.DOM.h1(null, "LUXTRUBUK lets good pals simulate JEOPARDY!™ games locally in a "+
          "modern browser. "
        ),
        React.DOM.p(null, 
          " There's no buzzing in to answer, so the first player or players to yell "+
          "out the correct answer get points. If you yell out the wrong answer, "+
          "you'll be deducted points. Be friends about the whole thing. "
        ), 
        React.DOM.div( {className:"newGameRow"}, 
          React.DOM.a( {href:"#/game/new", 'data-route':true, className:"newGame"}, "New Game")
        )
      )
    ); 
  } 
});

module.exports = HomePage;
