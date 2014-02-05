/** @jsx React.DOM */
Zepto(function(){
  var Luxtrubuk = require('./luxtrubuk.js');
  var $app = $('#app');
  var gL = gameLib = require('../../../lib/game.js')();

  // Routes
  var home = function() {
    $app.html([
      '<h1>LUXTRUBUK lets good pals simulate JEOPARDY!&trade; '
    , 'games locally in a modern browser.</h1>'
    , '<div class="newGameRow">'
    , '<a href="#/game/new" data-route class="newGame">New Game</a>'
    , '</div>'
    ].join(''))
  }

  var newGame = function() {
    $.ajax({
      url: '/api/game/randomHash?' + Math.random(),
      success: function(data){
        router("#/game/" + data, 'Game #' +data);
      }
    }); 
  }

  var gameRoute = function(gamehash) {
    gL.getClues(gamehash, function(clues){
      gameObj = new gL.Game(clues);
      //gameObj.clues = gameObj.clues.map(function(el, index, arr){
        //if(index < arr.length - 2) el.picked = true;
        //return el;
      //});
      gameObj.start();
      //gameObj.round(2);
      React.renderComponent(
        Luxtrubuk( {game:gameObj}),
        $app[0]
      );
    });
  }


  var err404 = function() {
    $app.html('<h1>A better "status" symbol cannot be found</h1><h3>What is "404"?</h3>');
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
    if(hash == '' || hash == '/')
      return home();
    if(hash === '/game/new')
      return newGame()
    var gameHash = hash.match(/\/game\/(\w*)/)
    if(gameHash != null && gameHash.length > 1)
      return gameRoute(gameHash[1])
    return err404()
  }

  // Wire up events for all [data-route] elements
  $('body').on('click', '[data-route]', function (ev) {
    router(this.hash);
  });

  router();
})
