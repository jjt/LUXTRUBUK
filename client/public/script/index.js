(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
Zepto(function(){
  var Luxtrubuk = require('./luxtrubuk.js');
  var $app = document.getElementById('app');
  
  // Gets the game from localStorage if available, otherwise makes an xhr req
  // If it has to make an xhr req, save the game locally
  var getGame = function(gamehash, next) {
    var gameKey = 'game-' + gamehash,
      localGame = localStorage.getItem(gameKey);
    
    if(localGame)
      return next(JSON.parse(localGame));

    $.getJSON('/api/game/' + gamehash, function(data){
      localStorage.setItem('game-'+gamehash, JSON.stringify(data));
      next(data);
    });
  }

  // Routes
  var game = function(gamehash) {
    console.log('GAME ', gamehash);
    getGame(gamehash, function(data){
      console.log(data);
      React.renderComponent(
        Luxtrubuk( {clues:data}),
        $app
      );
    })
  }

  var newGame = function() {
    console.log('newgame');
    $.ajax({
      url: '/api/game/randomHash',
      success: function(data){
        console.log("New game success!", data);
        router("#/game/" + data, 'Game #' +data);
      }
    }); 
  }

  var err404 = function() {
    $app.innerHTML = '<h1>A better "status" symbol cannot be found</h1><h3>What is "404"?</h3>';
  }

  var router = function(wlh, pushstate) {
    if(wlh == null)
      wlh = window.location.hash;
    else {
      if(pushstate)
        window.history.replaceState({},pushstate,wlh);
      else
        window.location.hash = wlh;
    }
    var hash = wlh.replace('#','');
    if(hash == '')
      return;
    if(hash === '/game/new')
      return newGame()
    var gameHash = hash.match(/\/game\/(\w*)/)
    if(gameHash != null && gameHash.length > 1)
      return game(gameHash[1])
    return err404()
  }

  // Wire up events for all [data-route] elements
  $('[data-route]').on('click', function (ev) {
    router(this.hash);
  });

  router();
})

},{"./luxtrubuk.js":2}],2:[function(require,module,exports){
/** @jsx React.DOM */

var cx = React.addons.classSet;

var log = function(){
  console.log.apply(console,_.initial(arguments));
}

var hexStr = function() {
  return Math.random().toString(16).slice(2,10);
}



var Clue = React.createClass({displayName: 'Clue',
  render: function(){
    var value = this.props.index * 200,
      valueClasses = cx({
        'Value': true,
        'fourDigit': value/1000 >= 1
      });
    return(
      React.DOM.div( {className:"Clue--holder"}, 
        React.DOM.h4( {className:valueClasses}, "$",this.props.index * 200)
      )
    )
  }
});

var Category = React.createClass({displayName: 'Category',
  render: function() {
    var clueIndex = 1,
      clueComponents = _.map(this.props.clues, function(clue) {
        return (Clue( {clue:clue, key:hexStr(), index:clueIndex++}));
      });
    return(
      React.DOM.div( {className:"Category"}, 
        React.DOM.div( {className:"Category--title"}, 
          React.DOM.h4(null, this.props.clues[0].category)
        ),
        clueComponents 
      )
    );
  }
});

var ClueDetail = React.createClass({displayName: 'ClueDetail',
  render: function () {
    return(
      React.DOM.div( {className:"ClueDetail"}
       
      ) 
    );
  }
});

var Game = React.createClass({displayName: 'Game',
  render: function() {
    var categoryComponents = _.map(this.props.round, function(category) {
        return (Category( {clues:category, key:hexStr()} ));
      });
    console.log(categoryComponents);
    return(
      React.DOM.div( {className:"Game"}, 
        React.DOM.div( {className:"ClueDetail"}, 
          ClueDetail(null )
        ),
        React.DOM.div( {className:"GameGrid"}, 
          categoryComponents 
        )
      )
    );
  }
});

var Luxtrubuk = React.createClass({displayName: 'Luxtrubuk',
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
      Game( {round:clues[round-1]} )
    );
  }
});

module.exports = Luxtrubuk;

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamp0L1NpdGVzL0xVWFRSVUJVSy9jbGllbnQvc3JjL3NjcmlwdC9jb21wb25lbnRzL2Zha2VfMWI0ZTU5NzYuanMiLCIvVXNlcnMvamp0L1NpdGVzL0xVWFRSVUJVSy9jbGllbnQvc3JjL3NjcmlwdC9jb21wb25lbnRzL2x1eHRydWJ1ay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuWmVwdG8oZnVuY3Rpb24oKXtcbiAgdmFyIEx1eHRydWJ1ayA9IHJlcXVpcmUoJy4vbHV4dHJ1YnVrLmpzJyk7XG4gIHZhciAkYXBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpO1xuICBcbiAgLy8gR2V0cyB0aGUgZ2FtZSBmcm9tIGxvY2FsU3RvcmFnZSBpZiBhdmFpbGFibGUsIG90aGVyd2lzZSBtYWtlcyBhbiB4aHIgcmVxXG4gIC8vIElmIGl0IGhhcyB0byBtYWtlIGFuIHhociByZXEsIHNhdmUgdGhlIGdhbWUgbG9jYWxseVxuICB2YXIgZ2V0R2FtZSA9IGZ1bmN0aW9uKGdhbWVoYXNoLCBuZXh0KSB7XG4gICAgdmFyIGdhbWVLZXkgPSAnZ2FtZS0nICsgZ2FtZWhhc2gsXG4gICAgICBsb2NhbEdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShnYW1lS2V5KTtcbiAgICBcbiAgICBpZihsb2NhbEdhbWUpXG4gICAgICByZXR1cm4gbmV4dChKU09OLnBhcnNlKGxvY2FsR2FtZSkpO1xuXG4gICAgJC5nZXRKU09OKCcvYXBpL2dhbWUvJyArIGdhbWVoYXNoLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdnYW1lLScrZ2FtZWhhc2gsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgIG5leHQoZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBSb3V0ZXNcbiAgdmFyIGdhbWUgPSBmdW5jdGlvbihnYW1laGFzaCkge1xuICAgIGNvbnNvbGUubG9nKCdHQU1FICcsIGdhbWVoYXNoKTtcbiAgICBnZXRHYW1lKGdhbWVoYXNoLCBmdW5jdGlvbihkYXRhKXtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgUmVhY3QucmVuZGVyQ29tcG9uZW50KFxuICAgICAgICBMdXh0cnVidWsoIHtjbHVlczpkYXRhfSksXG4gICAgICAgICRhcHBcbiAgICAgICk7XG4gICAgfSlcbiAgfVxuXG4gIHZhciBuZXdHYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ25ld2dhbWUnKTtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiAnL2FwaS9nYW1lL3JhbmRvbUhhc2gnLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IGdhbWUgc3VjY2VzcyFcIiwgZGF0YSk7XG4gICAgICAgIHJvdXRlcihcIiMvZ2FtZS9cIiArIGRhdGEsICdHYW1lICMnICtkYXRhKTtcbiAgICAgIH1cbiAgICB9KTsgXG4gIH1cblxuICB2YXIgZXJyNDA0ID0gZnVuY3Rpb24oKSB7XG4gICAgJGFwcC5pbm5lckhUTUwgPSAnPGgxPkEgYmV0dGVyIFwic3RhdHVzXCIgc3ltYm9sIGNhbm5vdCBiZSBmb3VuZDwvaDE+PGgzPldoYXQgaXMgXCI0MDRcIj88L2gzPic7XG4gIH1cblxuICB2YXIgcm91dGVyID0gZnVuY3Rpb24od2xoLCBwdXNoc3RhdGUpIHtcbiAgICBpZih3bGggPT0gbnVsbClcbiAgICAgIHdsaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgIGVsc2Uge1xuICAgICAgaWYocHVzaHN0YXRlKVxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30scHVzaHN0YXRlLHdsaCk7XG4gICAgICBlbHNlXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gd2xoO1xuICAgIH1cbiAgICB2YXIgaGFzaCA9IHdsaC5yZXBsYWNlKCcjJywnJyk7XG4gICAgaWYoaGFzaCA9PSAnJylcbiAgICAgIHJldHVybjtcbiAgICBpZihoYXNoID09PSAnL2dhbWUvbmV3JylcbiAgICAgIHJldHVybiBuZXdHYW1lKClcbiAgICB2YXIgZ2FtZUhhc2ggPSBoYXNoLm1hdGNoKC9cXC9nYW1lXFwvKFxcdyopLylcbiAgICBpZihnYW1lSGFzaCAhPSBudWxsICYmIGdhbWVIYXNoLmxlbmd0aCA+IDEpXG4gICAgICByZXR1cm4gZ2FtZShnYW1lSGFzaFsxXSlcbiAgICByZXR1cm4gZXJyNDA0KClcbiAgfVxuXG4gIC8vIFdpcmUgdXAgZXZlbnRzIGZvciBhbGwgW2RhdGEtcm91dGVdIGVsZW1lbnRzXG4gICQoJ1tkYXRhLXJvdXRlXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldikge1xuICAgIHJvdXRlcih0aGlzLmhhc2gpO1xuICB9KTtcblxuICByb3V0ZXIoKTtcbn0pXG4iLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIGN4ID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0O1xuXG52YXIgbG9nID0gZnVuY3Rpb24oKXtcbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSxfLmluaXRpYWwoYXJndW1lbnRzKSk7XG59XG5cbnZhciBoZXhTdHIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpLnNsaWNlKDIsMTApO1xufVxuXG5cblxudmFyIENsdWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdDbHVlJyxcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHRoaXMucHJvcHMuaW5kZXggKiAyMDAsXG4gICAgICB2YWx1ZUNsYXNzZXMgPSBjeCh7XG4gICAgICAgICdWYWx1ZSc6IHRydWUsXG4gICAgICAgICdmb3VyRGlnaXQnOiB2YWx1ZS8xMDAwID49IDFcbiAgICAgIH0pO1xuICAgIHJldHVybihcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJDbHVlLS1ob2xkZXJcIn0sIFxuICAgICAgICBSZWFjdC5ET00uaDQoIHtjbGFzc05hbWU6dmFsdWVDbGFzc2VzfSwgXCIkXCIsdGhpcy5wcm9wcy5pbmRleCAqIDIwMClcbiAgICAgIClcbiAgICApXG4gIH1cbn0pO1xuXG52YXIgQ2F0ZWdvcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdDYXRlZ29yeScsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNsdWVJbmRleCA9IDEsXG4gICAgICBjbHVlQ29tcG9uZW50cyA9IF8ubWFwKHRoaXMucHJvcHMuY2x1ZXMsIGZ1bmN0aW9uKGNsdWUpIHtcbiAgICAgICAgcmV0dXJuIChDbHVlKCB7Y2x1ZTpjbHVlLCBrZXk6aGV4U3RyKCksIGluZGV4OmNsdWVJbmRleCsrfSkpO1xuICAgICAgfSk7XG4gICAgcmV0dXJuKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcIkNhdGVnb3J5XCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcIkNhdGVnb3J5LS10aXRsZVwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIHRoaXMucHJvcHMuY2x1ZXNbMF0uY2F0ZWdvcnkpXG4gICAgICAgICksXG4gICAgICAgIGNsdWVDb21wb25lbnRzIFxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgQ2x1ZURldGFpbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0NsdWVEZXRhaWwnLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4oXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiQ2x1ZURldGFpbFwifVxuICAgICAgIFxuICAgICAgKSBcbiAgICApO1xuICB9XG59KTtcblxudmFyIEdhbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6ICdHYW1lJyxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2F0ZWdvcnlDb21wb25lbnRzID0gXy5tYXAodGhpcy5wcm9wcy5yb3VuZCwgZnVuY3Rpb24oY2F0ZWdvcnkpIHtcbiAgICAgICAgcmV0dXJuIChDYXRlZ29yeSgge2NsdWVzOmNhdGVnb3J5LCBrZXk6aGV4U3RyKCl9ICkpO1xuICAgICAgfSk7XG4gICAgY29uc29sZS5sb2coY2F0ZWdvcnlDb21wb25lbnRzKTtcbiAgICByZXR1cm4oXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiR2FtZVwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJDbHVlRGV0YWlsXCJ9LCBcbiAgICAgICAgICBDbHVlRGV0YWlsKG51bGwgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiR2FtZUdyaWRcIn0sIFxuICAgICAgICAgIGNhdGVnb3J5Q29tcG9uZW50cyBcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTHV4dHJ1YnVrID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiAnTHV4dHJ1YnVrJyxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcm91bmQgPSAxO1xuICAgIHZhciBjbHVlcyA9IF8uY2hhaW4odGhpcy5wcm9wcy5jbHVlcylcbiAgICAgIC5ncm91cEJ5KGZ1bmN0aW9uKGNsdWUpIHtyZXR1cm4gY2x1ZS5yb3VuZH0pXG4gICAgICAubWFwKGZ1bmN0aW9uKHJvdW5kKSB7XG4gICAgICAgIHJldHVybiBfLmNoYWluKHJvdW5kKVxuICAgICAgICAgIC5ncm91cEJ5KGZ1bmN0aW9uKGNsdWUpe3JldHVybiBjbHVlLmNhdGVnb3J5fSlcbiAgICAgICAgICAudmFsdWVzKClcbiAgICAgICAgICAuc2h1ZmZsZSgpXG4gICAgICAgICAgLnZhbHVlKCk7XG4gICAgICB9KVxuICAgICAgLnRhcChsb2cpXG4gICAgICAudmFsdWUoKTtcbiAgICByZXR1cm4oXG4gICAgICBHYW1lKCB7cm91bmQ6Y2x1ZXNbcm91bmQtMV19IClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMdXh0cnVidWs7XG4iXX0=
