/** @jsx React.DOM */
var Clue = require('./Clue.js');
module.exports = React.createClass({
  clueClick: function(clueHash){
    this.props.clueClick(clueHash);
  }
, getClueComponents: function () {
    return _.map(this.props.clues, function(clue, index) {
        var value = this.props.round * (index+1) * 200;
        return (Clue( {key:clue.cluehash, picked:clue.picked,
          clueClick:this.clueClick, value:value} ));
    },this);
  }
, render: function() {
    var clueComponents = this.getClueComponents();
    return(
      React.DOM.div( {className:"Category"}, 
        React.DOM.div( {className:"Category__title"}, 
          React.DOM.h5(null,  this.props.key )
        ),
        clueComponents 
      )
    );
  }
});
