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
      <form className={cx({FinalRound: true, hide: this.state.hide})} 
        onSubmit={this.onSubmit}
      >
        <h2>Final Round Category</h2>
        <h1>{this.props.clue.category}</h1>
        <div className="Controls">
          <div className="Control__group">
            <input type="text" ref={this.props.playerKeys[0]}
              placeholder="0"/>
          </div>
          <div className="Control__group">
            <input type="text" ref={this.props.playerKeys[1]}
              placeholder="0"/>
          </div>
          <div className="Control__group">
            <input type="text" ref={this.props.playerKeys[2]}
              placeholder="0"/>
          </div>
          <div className="Control__group">
            <button type="submit" className="btn">Bid</button>
          </div>
        </div>
      </form>
    )
  }
});

