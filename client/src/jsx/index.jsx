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
      <Luxtrubuk />,
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
