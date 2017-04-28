const shuffledDeck = require('deck');


function startGame(connectedPlayers){
  return {
    deck: shuffledDeck,
    discard: [],
    hands: {
      connectedPlayers.host.id: draw(6),
      connectedPlayers.guest.id: draw(5)
    },
    dropPiles: {
      connectedPlayers.host.id: [],
      connectedPlayers.guest.id: []
    }
  }
}



function getFilteredStateForUser(gameState, userId, opponentId){
  return {
    deck: gameState.deck.length === 0 ? 0 : 1,
    discard: last(gameState.discard),
    userHand: gameState.hands.userId,
    opponentHand: gameState.hands.opponentId,
    userDiscard: gameState.dropPiles.userId,
    opponentDiscard: gameState.dropPiles.opponentId,
  }
}







module.exports.getFilteredStateForUser;
module.exports.draw = draw;
module.exports.playCard = playCard;
