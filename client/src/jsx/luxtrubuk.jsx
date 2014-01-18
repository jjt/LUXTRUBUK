/** @jsx React.DOM */


var cx = React.addons.classSet;

var log = function(){
  console.log.apply(console,_.initial(arguments));
}

var hexStr = function() {
  return Math.random().toString(16).slice(2,10);
}



var Clue = React.createClass({
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
      <div className="Clue--holder" onClick={this.handleClick}>
        <span className={valueClasses}>${value}</span>
      </div>
    )
  }
});

var Category = React.createClass({
  valueClick: function(row) {
  },
  render: function() {
    console.log(this.props);
    var clueIndex = 1,
        column = this.props.column,
        clueComponents = _.map(this.props.clues, function(clue) {
          return (<Clue key={hexStr()} round={clue.round} row={clueIndex++}
            column={column} valueClick={this.valueClick}/>);
        });
    return(
      <div className="Category">
        <div className="Category--title">
          <h4>{this.props.clues[0].category}</h4>
        </div>
        {clueComponents} 
      </div>
    );
  }
});

var ClueDetail = React.createClass({
  render: function () {
    return(
      <div className="ClueDetail">
       
      </div> 
    );
  }
});

var Game = React.createClass({
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
          return (<Category clues={category} key={hexStr()} column={index++}
            valueClick={this.valueClick}/>);
        });
    console.log(categoryComponents);
    return(
      <div className="Game">
        <div className="ClueDetail">
          <ClueDetail />
        </div>
        <div className="GameGrid">
          {categoryComponents} 
        </div>
      </div>
    );
  }
});

var Luxtrubuk = React.createClass({
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
      <Game clues={clues} />
    );
  }
});

module.exports = Luxtrubuk;
