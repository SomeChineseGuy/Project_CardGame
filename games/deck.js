
var range = require('lodash/range');
var shuffle = require('lodash/shuffle');

function newDeck() {
  const suits = [0, 1, 2, 3];
  return range(52).map(idx => (
    [Math.floor(idx / 4) + 1,
      suits[idx % 4],
      idx + 1]
 ));
}

function getDeck(){
  return shuffle(newDeck());
}

module.exports.getDeck = getDeck;
