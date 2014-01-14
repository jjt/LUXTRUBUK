(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
Zepto(function(){
  var Luxtrubuk = require('./luxtrubuk.js');
  var $app = document.getElementById('app');
  // Routes
  var game = function(gamehash) {
    $.ajax({
      url: '/api/game/' + gamehash
    });
    React.renderComponent(
      Luxtrubuk(null ),
      $app
    );
  }

  var newGame = function() {
    console.log('newgame');
    $.ajax({
      url: '/api/game/randomHash',
      success: function(data){
        console.log("New game success!", data);
        router("#/game/" + data, 'Game #'+data);
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
  console.log($('[data-route]'));
  $('[data-route]').on('click', function (ev) {
    router(this.hash);
  });

  router();
})

},{"./luxtrubuk.js":2}],2:[function(require,module,exports){
/** @jsx React.DOM */
var Luxtrubuk = React.createClass({displayName: 'Luxtrubuk',
  render: function() {
    return(React.DOM.h1(null, "LUXTRUBUK"));
  }
});

module.exports = Luxtrubuk;

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamp0L1NpdGVzL0xVWFRSVUJVSy9jbGllbnQvc3JjL3NjcmlwdC9jb21wb25lbnRzL2Zha2VfYWI2ODFlYmQuanMiLCIvVXNlcnMvamp0L1NpdGVzL0xVWFRSVUJVSy9jbGllbnQvc3JjL3NjcmlwdC9jb21wb25lbnRzL2x1eHRydWJ1ay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5aZXB0byhmdW5jdGlvbigpe1xuICB2YXIgTHV4dHJ1YnVrID0gcmVxdWlyZSgnLi9sdXh0cnVidWsuanMnKTtcbiAgdmFyICRhcHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJyk7XG4gIC8vIFJvdXRlc1xuICB2YXIgZ2FtZSA9IGZ1bmN0aW9uKGdhbWVoYXNoKSB7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJy9hcGkvZ2FtZS8nICsgZ2FtZWhhc2hcbiAgICB9KTtcbiAgICBSZWFjdC5yZW5kZXJDb21wb25lbnQoXG4gICAgICBMdXh0cnVidWsobnVsbCApLFxuICAgICAgJGFwcFxuICAgICk7XG4gIH1cblxuICB2YXIgbmV3R2FtZSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCduZXdnYW1lJyk7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJy9hcGkvZ2FtZS9yYW5kb21IYXNoJyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIk5ldyBnYW1lIHN1Y2Nlc3MhXCIsIGRhdGEpO1xuICAgICAgICByb3V0ZXIoXCIjL2dhbWUvXCIgKyBkYXRhLCAnR2FtZSAjJytkYXRhKTtcbiAgICAgIH1cbiAgICB9KTsgXG4gIH1cblxuICB2YXIgZXJyNDA0ID0gZnVuY3Rpb24oKSB7XG4gICAgJGFwcC5pbm5lckhUTUwgPSAnPGgxPkEgYmV0dGVyIFwic3RhdHVzXCIgc3ltYm9sIGNhbm5vdCBiZSBmb3VuZDwvaDE+PGgzPldoYXQgaXMgXCI0MDRcIj88L2gzPic7XG4gIH1cblxuICB2YXIgcm91dGVyID0gZnVuY3Rpb24od2xoLCBwdXNoc3RhdGUpIHtcbiAgICBpZih3bGggPT0gbnVsbClcbiAgICAgIHdsaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgIGVsc2Uge1xuICAgICAgaWYocHVzaHN0YXRlKVxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30scHVzaHN0YXRlLHdsaCk7XG4gICAgICBlbHNlXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gd2xoO1xuICAgIH1cbiAgICB2YXIgaGFzaCA9IHdsaC5yZXBsYWNlKCcjJywnJyk7XG4gICAgaWYoaGFzaCA9PSAnJylcbiAgICAgIHJldHVybjtcbiAgICBpZihoYXNoID09PSAnL2dhbWUvbmV3JylcbiAgICAgIHJldHVybiBuZXdHYW1lKClcbiAgICB2YXIgZ2FtZUhhc2ggPSBoYXNoLm1hdGNoKC9cXC9nYW1lXFwvKFxcdyopLylcbiAgICBpZihnYW1lSGFzaCAhPSBudWxsICYmIGdhbWVIYXNoLmxlbmd0aCA+IDEpXG4gICAgICByZXR1cm4gZ2FtZShnYW1lSGFzaFsxXSlcbiAgICByZXR1cm4gZXJyNDA0KClcbiAgfVxuXG4gIC8vIFdpcmUgdXAgZXZlbnRzIGZvciBhbGwgW2RhdGEtcm91dGVdIGVsZW1lbnRzXG4gIGNvbnNvbGUubG9nKCQoJ1tkYXRhLXJvdXRlXScpKTtcbiAgJCgnW2RhdGEtcm91dGVdJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgcm91dGVyKHRoaXMuaGFzaCk7XG4gIH0pO1xuXG4gIHJvdXRlcigpO1xufSlcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIEx1eHRydWJ1ayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ0x1eHRydWJ1aycsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuKFJlYWN0LkRPTS5oMShudWxsLCBcIkxVWFRSVUJVS1wiKSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEx1eHRydWJ1aztcbiJdfQ==
