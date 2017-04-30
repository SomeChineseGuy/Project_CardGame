
var range = require('lodash/range');
var shuffle = require('lodash/shuffle');

function newDeck() {
 const suits = ['diamond', 'clubs', 'hearts', 'spades'];
 return range(52).map(idx => ({
   suit: suits[idx % 4],
   id: idx + 1,
   rank: Math.floor(idx / 4) + 1
 }));
}

function getDeck(){
 return shuffle(newDeck());
}

module.exports.getDeck = getDeck;
