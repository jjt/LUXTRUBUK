/** @jsx React.DOM */
var PlayerAnswerBtns = require('./PlayerAnswerBtns.js');
var ucFirst = function (str) {
  if(!_.isString(str))
    return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
var cx = React.addons.classSet;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      showAnswer: false
    , answers: _.zipObject(this.props.playerKeys, [false, false, false])
    }
  }
, getDefaultProps: function () {
    return {
      clue: {}
    } 
  }
, componentWillReceiveProps: function(nextprops) {
    this.setState(this.getInitialState()); 
  }

, showAnswer: function() {
    this.setState({showAnswer: true});
  }
, submit: function(ev) { 
    if(this.props.finalBids)
      this.props.reportFinalAnswers(this.state.answers, this.props.finalBids);
    else
      this.props.reportAnswers(this.state.answers, this.props.clue.value);
    this.props.onClueClose();
  }
, reportAnswer: function(player, answer) {
    var newState = this.state;
    newState.answers[player] = answer;
    this.setState(newState);
  }
, getAnsBtnComponents: function() {
    return _.map(this.state.answers, function(answer, name) {
      return (PlayerAnswerBtns( {player:name, reportAnswer:this.reportAnswer,
        key:name, answer:answer, disabled:!this.state.showAnswer} )
      ) 
    }, this);
  }
, render: function () {
    return(
      React.DOM.div( {className:cx({ClueDetail: true, hide: !this.props.showClueDetail})}, 
        React.DOM.div( {className:"ClueDetail__title"}, this.props.clue.category),
        React.DOM.div( {className:"ClueDetail__clue"}, this.props.clue.clue),
        React.DOM.div( {className:"ClueDetail__answerHolder"}, 
          React.DOM.div( {className:cx({"ClueDetail__answer":true,
            show: this.state.showAnswer})}, ucFirst(this.props.clue.answer)),
          React.DOM.a( {className:cx({"ClueDetail__showAnswer":true,
            hide:this.state.showAnswer}), onClick:this.showAnswer}, 
            " Show Answer") 
        ),
        React.DOM.div( {className:"Controls"}, 
          this.getAnsBtnComponents(), 
          React.DOM.div( {className:"Player__group"}, 
            React.DOM.a( {disabled:this.state.showAnswer ? null: 'disabled',
              onClick:this.submit,
              className:cx({
                ClueDetail__done: true,
                'btn-disabled': this.state.disabled
              })}
            , 
              " Done "
            ) 
          )
        )
      ) 
    );
  }
});


