/** @jsx React.DOM */

var cx = React.addons.classSet;

var log = function(){
  console.log.apply(console,_.initial(arguments));
}

var hexStr = function() {
  return Math.random().toString(16).slice(2,10);
}



var Clue = React.createClass({
  render: function(){
    var value = this.props.index * 200,
      valueClasses = cx({
        'Value': true,
        'fourDigit': value/1000 >= 1
      });
    return(
      <div className="Clue--holder">
        <h4 className={valueClasses}>${this.props.index * 200}</h4>
      </div>
    )
  }
});

var Category = React.createClass({
  render: function() {
    var clueIndex = 1,
      clueComponents = _.map(this.props.clues, function(clue) {
        return (<Clue clue={clue} key={hexStr()} index={clueIndex++}/>);
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
  render: function() {
    var categoryComponents = _.map(this.props.round, function(category) {
        return (<Category clues={category} key={hexStr()} />);
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
      <Game round={clues[round-1]} />
    );
  }
});

module.exports = Luxtrubuk;
