/** @jsx React.DOM */


var cx = React.addons.classSet;

var log = function(){
  console.log.apply(console,_.initial(arguments));
}

var hexStr = function() {
  return Math.random().toString(16).slice(2,10);
}



var Clue = React.createClass({displayName: 'Clue',
  handleClick: function() {
    console.log(this.props);
    this.props.valueClick(this.props.row);
  },
  render: function(){
    var value = this.props.row * this.props.round * 200,
        valueClasses = cx({
          'Value': true,
          'fourDigit': value/1000 >= 1
        });
    return(
      React.DOM.div( {className:"Clue--holder", onClick:this.handleClick}, 
        React.DOM.span( {className:valueClasses}, "$",value)
      )
    )
  }
});

var Category = React.createClass({displayName: 'Category',
  valueClick: function(row) {
  },
  render: function() {
    console.log(this.props);
    var clueIndex = 1,
        column = this.props.column,
        clueComponents = _.map(this.props.clues, function(clue) {
          return (Clue( {key:hexStr(), round:clue.round, row:clueIndex++,
            column:column, valueClick:this.valueClick}));
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
  getInitialState: function() {
    return {
      round: 1
    }
  },
  getRoundClues: function() {
    return this.props.clues[this.state.round - 1];
  }, 
  valueClick: function(row,col) {
    console.log(row,col); 
  },
  render: function() {
    var index = 1
        categoryComponents = _.map(this.getRoundClues(), function(category) {
          return (Category( {clues:category, key:hexStr(), column:index++,
            valueClick:this.valueClick}));
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
      Game( {clues:clues} )
    );
  }
});

module.exports = Luxtrubuk;
