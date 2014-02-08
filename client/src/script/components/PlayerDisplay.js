/** @jsx React.DOM */
var cx = React.addons.classSet;
module.exports = React.createClass({
  render: function () {
    var cxPlayerDisplay = cx({
      "PlayerDisplay": true
    , "red": this.props.score < 0
    , "PlayerDisplay--winner": this.props.winner
    });
    var cxIcon = cx({
      'icon-award': true
    , 'hide': !this.props.winner
    });
    return(
      React.DOM.div( {className:cxPlayerDisplay}, 
        React.DOM.div( {className:"title"}, 
          React.DOM.i( {className:cxIcon}),
          this.props.name,
          React.DOM.i( {className:cxIcon})
          ),
        React.DOM.p( {className:"PlayerDisplay__score"}, "$",this.props.score)
      )
    );
  }
});
