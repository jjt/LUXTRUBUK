/** @jsx React.DOM */
var cx = React.addons.classSet;
module.exports = React.createClass({
  clickHandler: function(ansKey) {
    return function() {
      if(this.props.disabled)
        return;
      if(this.props.answer === ansKey)
        ansKey = false;
      this.reportAnswer(ansKey);
    }.bind(this)
  }
, reportAnswer: function(answer) {
    return this.props.reportAnswer(this.props.key, answer);
  }
, render: function() {
    return(
      React.DOM.div( {className:"Player__group"}, 
        React.DOM.i(
          {onClick:this.clickHandler('wrong'),
          disabled:this.props.disabled ? '' : null,
          className:cx({
            AnswerBtn__wrong: true,
            'icon-cancel': true,
            'selected': this.props.answer === 'wrong',
            'btn-disabled': this.props.disabled,
            'btn-error': this.props.answer === 'wrong'})}
        ),
        React.DOM.i(
          {onClick:this.clickHandler('right'),
          disabled:this.props.disabled ? '' : null,
          className:cx({
            AnswerBtn__right: true,
            'icon-ok': true,
            'selected': this.props.answer === 'right',
            'btn-disabled': this.props.disabled,
            'btn-success': this.props.answer === 'right'})}
        )
      ) 
    )
  }
});


