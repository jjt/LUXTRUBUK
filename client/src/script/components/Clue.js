/** @jsx React.DOM */
var cx = React.addons.classSet;
module.exports = React.createClass({
  getInitialState: function() {
    return {
      picked: this.props.picked
    }
  }
, clueClick: function(){
    if(this.state.picked)
      return;
    this.props.clueClick(this.props.key);
    this.setState({picked: true});
  }
, render: function(){
    var clueClasses = cx({
          'Clue': true,
          'Clue--picked':this.state.picked
        })
      , valueClasses = cx({
          'Clue__value': true,
          'fourDigit': this.props.value/1000 >= 1
        });
    return(
      React.DOM.div( {onClick:this.clueClick, className:clueClasses}, 
        React.DOM.span( {className:valueClasses}, "$",this.props.value)
      )
    )
  }
});

