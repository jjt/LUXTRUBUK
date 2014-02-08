/** @jsx React.DOM */
module.exports = React.createClass({
  getInitialState: function () {
    return {
      bids: _.zipObject(this.props.playerKeys, [0,0,0])
    , hide: false
    } 
  }
, onInputChange: function (key, value) {
    var newPlayerBids = this.state.bids;
    newPlayerBids[key] = value;
    this.setState({playerBids: newPlayerBids});
}
, onSubmit: function (ev) {
    ev.preventDefault();
    var bids = {}
    _.forEach(this.refs, function (ref, index) {
      bids[index] = +ref.getDOMNode().value;
    });
    this.props.submitFinalBids(bids); 
    this.setState({hide: true});
  }
, render: function(){
    return(
      React.DOM.form( {className:cx({FinalRound: true, hide: this.state.hide}), 
        onSubmit:this.onSubmit}
      , 
        React.DOM.h2(null, "Final Round Category"),
        React.DOM.h1(null, this.props.clue.category),
        React.DOM.div( {className:"Controls"}, 
          React.DOM.div( {className:"Control__group"}, 
            React.DOM.input( {type:"text", ref:this.props.playerKeys[0],
              placeholder:"0"})
          ),
          React.DOM.div( {className:"Control__group"}, 
            React.DOM.input( {type:"text", ref:this.props.playerKeys[1],
              placeholder:"0"})
          ),
          React.DOM.div( {className:"Control__group"}, 
            React.DOM.input( {type:"text", ref:this.props.playerKeys[2],
              placeholder:"0"})
          ),
          React.DOM.div( {className:"Control__group"}, 
            React.DOM.button( {type:"submit", className:"btn"}, "Bid")
          )
        )
      )
    )
  }
});

