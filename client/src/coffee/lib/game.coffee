_ = require 'lodash'

log = (msg) ->
  console.log.call(console, msg)

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

sortToMiddle = (arr, sortByFn = _.identity)->
  sorted = _.sortBy(arr, sortByFn)
  head = _.filter sorted, (el, index, arr)->
    (index % 2) == 0
  tail = _.difference(sorted, head).reverse()
  out = head.concat tail
  out

sortToMiddleByLen = (arr) ->
  sortToMiddle arr, (item)->
    item.length
 
sortCatGroup = (arr)->
  arr = sortToMiddle arr, (item)->
    item.cat.length

cluesByRound = (clues, roundNum)->
  _.filter clues, 'round': roundNum

cluesByCategory = (clues, category)->
  _.filter clues, 'category': category


defaultPlayers =
  Hortence: 0
  Edmund: 0
  Aloisius: 0

class Game
  constructor: (@clues, @players = defaultPlayers)->
    @gamehash = @clues[0].gamehash
    @_round = 0

  getClue: (cluehash)->
    if not cluehash?
      return @clues[0]
    
    clue = _.find @clues, cluehash: cluehash
    clue

  pickClue: (cluehash)->
    clue = @getClue cluehash
    clue.picked = true
    clue

  # Get clues from the current round
  curClues: ()->
    cluesByRound(@clues, @_round)

  curCluesByCat: ()->
    clues = @curClues()
    a = _.chain(clues)
      .groupBy('category')
      .mapValues((v,k)->
        cat: k
        clues: v
      )
      .toArray()
      .tap(sortCatGroup)
      .valueOf()
    #sortCatGroup(a)

  updateGame: ()->
    cluesLeft = _.filter(@curClues(), {picked: undefined}).length
    if cluesLeft <= 0
      @_round++
      return true
    false

  getPlayers: ()-> @players

  playerResult: (player, answer, value)->
    # Return if answer is neither 'right' nor 'wrong'
    return if not answer
    @players[player] += value * (if answer == 'right' then 1 else -1)

  reportAnswers: (results, value) ->
    for own k,v of results
      @playerResult k, v, value

  start: ()->
    @_round = 1

  round: ()->
    @_round


module.exports = ()->
  {sortToMiddle, getRandomHash, getClues, sortToMiddleByLen,
    cluesByRound, Game}
