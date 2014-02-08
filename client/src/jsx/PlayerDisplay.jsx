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
      <div className={cxPlayerDisplay}>
        <div className="title">
          <i className={cxIcon}></i>
          {this.props.name}
          <i className={cxIcon}></i>
          </div>
        <p className="PlayerDisplay__score">${this.props.score}</p>
      </div>
    );
  }
});
