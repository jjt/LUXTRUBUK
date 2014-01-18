_ = require 'lodash'

getClues = (gamehash, next)->
  gameKey = "game-" + gamehash
  localGame = localStorage.getItem(gameKey)
  return next(JSON.parse(localGame)) if localGame
  $.getJSON "/api/game/" + gamehash, (data)->
    localStorage.setItem "game-" + gamehash, JSON.stringify(data)
    next data

getRandomHash = (next)->
  $.ajax
    url: 'api/game/randomHash'
    success: (data) ->
      next(data)

sortToMiddleByLen = (array) ->
  sortToMiddle array, (a,b)->
    -1 if a.length < b.length
    1 if a.length > b.length
    0

sortToMiddle = (array, sortFn=(a,b)-> if a < b then -1 else 1)->
  sorted = array.sort(sortFn)
  head = _.filter sorted, (el, index, arr)->
    (index % 2) == 0
  tail = _.difference(sorted, head).reverse()
  head.concat tail

  

# Takes an array of clue rows and builds up a structured game
formatClues = (clues)->
  _.chain(clues)
    # Group by rounds
    .groupBy((clue)-> return clue.round)
    .map((round)->
      # For each round, group by category
      _.chain(round)
        .groupBy((clue)-> return clue.category)
        .values()
        .sortToMiddle()
        .value()
    )
    .tap(log)
    .value()


module.exports = ()->
  {formatClues, sortToMiddle, getRandomHash, getClues, sortToMiddleByLen}
