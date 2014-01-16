/** @jsx React.DOM */

var cx = React.addons.classSet;

var log = function(){
  console.log.apply(console,_.initial(arguments));
}

var hexStr = function() {
  return Math.random().toString(16).slice(2,10);
}



var Clue = React.createClass({displayName: 'Clue',
  render: function(){
    var value = this.props.index * 200,
      valueClasses = cx({
        'Value': true,
        'fourDigit': value/1000 >= 1
      });
    return(
      React.DOM.div( {className:"Clue--holder"}, 
        React.DOM.h4( {className:valueClasses}, "$",this.props.index * 200)
      )
    )
  }
});

var Category = React.createClass({displayName: 'Category',
  render: function() {
    var clueIndex = 1,
      clueComponents = _.map(this.props.clues, function(clue) {
        return (Clue( {clue:clue, key:hexStr(), index:clueIndex++}));
      });
    return(
      React.DOM.div( {className:"Category"}, 
        React.DOM.div( {className:"Category--title"}, 
          React.DOM.h4(null, this.props.clues[0].category)
        ),
        clueComponents 
      )
    );
  }
});

var ClueDetail = React.createClass({displayName: 'ClueDetail',
  render: function () {
    return(
      React.DOM.div( {className:"ClueDetail"}
       
      ) 
    );
  }
});

var Game = React.createClass({displayName: 'Game',
  render: function() {
    var categoryComponents = _.map(this.props.round, function(category) {
        return (Category( {clues:category, key:hexStr()} ));
      });
    console.log(categoryComponents);
    return(
      React.DOM.div( {className:"Game"}, 
        React.DOM.div( {className:"ClueDetail"}, 
          ClueDetail(null )
        ),
        React.DOM.div( {className:"GameGrid"}, 
          categoryComponents 
        )
      )
    );
  }
});

var Luxtrubuk = React.createClass({displayName: 'Luxtrubuk',
  render: function() {
    var round = 1;
    var clues = _.chain(this.props.clues)
      .groupBy(function(clue) {return clue.round})
      .map(function(round) {
        return _.chain(round)
          .groupBy(function(clue){return clue.category})
          .values()
          .shuffle()
          .value();
      })
      .tap(log)
      .value();
    return(
      Game( {round:clues[round-1]} )
    );
  }
});

module.exports = Luxtrubuk;
