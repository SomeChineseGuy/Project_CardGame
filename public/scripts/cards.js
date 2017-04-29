/* Creates a deck of 52 cards each id by rank (ie:1 - 4 are Aces or 5 - 8 are twos) */
const range = require('lodash/range');
const shuffle = require('lodash/shuffle');

function getDeck () {
  const suits = ['diamond', 'club', 'heart', 'spade'];
  return range(52).map(idx => ({
    suit: suits[idx % 4],
    id: idx + 1,
    rank: Math.floor(idx / 4) + 1
  }));
}

console.log(shuffle(getDeck()));