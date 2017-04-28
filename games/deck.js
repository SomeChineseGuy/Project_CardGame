var range = require('lodash/range');
var shuffle = require('lodash/shuffle');
function getDeck () {
 const suits = ['diamond', 'clubs', 'hearts', 'spades'];
 return range(52).map(idx => ({
   suit: suits[idx % 4],
   id: idx + 1,
   rank: Math.floor(idx / 4) + 1
 }));
}

module.exports.getDeck = getDeck;
