const init_state = {
    deck: [],
    host: 0,
    guest: 0,
    discard: [],
    drop_pile: [],
    hands: [[], []],
    finished: false
};

const init_moves = {
    draw: true,
    take_top: true,
    take_all: true,
    drop_set: false,
    attach_one: false,
    discard: false
}

function startGame(deck, host_id, guest_id){
  init_state.deck = deck;
  init_state.host = host_id;
  init_state.guest = guest_id;
  return init_state;
}

function getMoves(gameState, user_id, first_move){
  if(first_move){
    return init_moves;
  } else {
    const user_index = gameState.host === user_id ? 0 : 1;
    const user_hand = gameState.hands[user_index];
    const has_3_in_hand = check3OfAKind(user_hand);
    const has_1_for_drop_pile = isCardValidForDropPile(user_hand, gameState.drop_pile);
    const moves = {
      draw: false,
      take_top: false,
      take_all: false,
      drop_set: false,
      attach_one: false,
      discard: true
    }
    if(has_3_in_hand){
      moves.drop_set = true;
    }
    if(has_1_for_drop_pile){
      moves.attach_one = true;
    }
    return moves;
  }
}

function drawCard(gameState, user_id, init){
  if(gameState.finished){
    return gameState;
  }
  if(init){
    gameState.hands[0] = gameState.deck.splice(0, 6);
    gameState.hands[1] = gameState.deck.splice(0, 5);
    return gameState;
  }
  if(user_id === gameState.host){
    gameState.hands[0].push(gameState.deck.splice(0,1));
  } else {
    gameState.hands[1].push(gameState.deck.splice(0,1));
  }
  return gameState;
}

function drawCardFromDiscard(gameState, user_id) {
  if(gameState.finished){
    return gameState;
  }
  const user_index = gameState.host === user_id ? 0 : 1;
  gameState.hands[user_index].push(gameState.discard.pop());
  return gameState;
}

function drawAllCardsFromDiscard(gameState, user_id){
  if(gameState.finished || gameState.discard.length === 1){
    return gameState;
  }
  const user_index = gameState.host === user_id ? 0 : 1;
  gameState.hands[user_index] = gameState.hands[user_index].concat(gameState.discard);
  gameState.discard = [];
  return gameState;
}

function layDownSet(gameState, user_id){
  if(gameState.finished){
    return gameState;
  }
  const user_index = gameState.host === user_id ? 0 : 1;
  const user_hand = gameState.hands[user_index];
  const rankGroups =  groupRanks(user_hand);
  for(let rank in rankGroups){
    if(rankGroups[rank] >= 3){
      gameState.drop_pile = gameState.drop_pile.concat(user_hand.filter(card => {
        return card[0] == rank;
      }));
      gameState.hands[user_index] = user_hand.filter(card => {
        return card[0] != rank;
      });
    }
  }
  return gameState;
}

function layDownCard(gameState, user_id){
  if(gameState.finished){
    return gameState;
  }
  const user_index = gameState.host === user_id ? 0 : 1;
  const user_hand = gameState.hands[user_index];
  const rankGroups =  groupRanks(gameState.drop_pile);
  const ranks_in_drop_pile = Object.keys(rankGroups);
  const card_to_drop = user_hand.find(card => ranks_in_drop_pile.find(rank => rank == card[0]));
  gameState.hands[user_index] = user_hand.filter(card => card !== card_to_drop);
  gameState.drop_pile.push(card_to_drop);
  return gameState;
}

function discardCard(gameState, user_id, card_id){
  if(gameState.finished){
    return gameState;
  }
  const user_index = gameState.host === user_id ? 0 : 1;
  const card_in_hand = gameState.hands[user_index].find(card => card[2] === card_id);
  if(card_in_hand){
    gameState.discard.push(card_in_hand);
    gameState.hands[user_index] = gameState.hands[user_index].filter(card => card[2] !== card_id);
  }
  return gameState;
}

function filterGameStateForUser(gameState, user_id){
  const filteredGS = {
    deck: gameState.deck.length,
    discard: [],
    hand: [],
    opponent_hand: 0
  }
  if(gameState.discard.length !== 0){
    filteredGS.discard = gameState.discard[gameState.discard.length - 1];
  }
  if(user_id === gameState.host){
    filteredGS.hand = gameState.hands[0].sort((a, b) => a[2] > b[2]);
    filteredGS.opponent_hand = gameState.hands[1].length;
  } else {
    filteredGS.hand = gameState.hands[1].sort((a, b) => a[2] > b[2]);
    filteredGS.opponent_hand = gameState.hands[0].length;
  }
  const grouped_drop_pile = groupDropPile(gameState.drop_pile);
  const grouped = [];
  for(let group in grouped_drop_pile){
    grouped.push(grouped_drop_pile[group]);
  }
  filteredGS.drop_pile = grouped;
  return filteredGS;
}

function checkWinnerCondition(gameState, user_id){
  const user_index = gameState.host === user_id ? 0 : 1;
  const opponent_index = gameState.host === user_id ? 1 : 0;
  if(gameState.deck.length === 0 && gameState.discard.length === 0){
    return gameState.hands[user_index].length < gameState.hands[opponent_index].length;
  }
  if(gameState.hands[user_index].length === 0 || gameState.hands[user_index].length === 1){
    return true;
  } else {
    return false;
  }
}

function isSetValid(set, rank){
  const rankGroups = groupRanks(set);
  return rankGroups[rank] >= 3;
}

function isCardValidForDropPile(user_hand, drop_pile){
  let valid = false;
  user_hand.forEach((hand_card) => {
    const found = drop_pile.find((drop_card) => {
      return hand_card[0] === drop_card[0];
    });
    if(found){
      valid = true;
    }
  });
  return valid;
}

function check3OfAKind(user_hand) {
  const rankGroups =  groupRanks(user_hand);
  for(let rank in rankGroups){
    if(rankGroups[rank] >= 3){
      return true;
    }
  }
  return false;
}

function groupRanks(hand) {
  return hand.reduce(function(counter, item) {
      var p = item[0];
      counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
      return counter;
  },{})
}

function groupDropPile(drop_pile){
  return drop_pile.reduce(function(counter, item) {
      var p = item[0];
      if(!counter.hasOwnProperty(p)){
        counter[p] = [];
      }
      counter[p].push(item);
      return counter;
  },{})
}


module.exports.startGame = startGame;
module.exports.getMoves = getMoves;
module.exports.drawCard = drawCard;
module.exports.drawCardFromDiscard = drawCardFromDiscard;
module.exports.drawAllCardsFromDiscard = drawAllCardsFromDiscard;
module.exports.layDownSet = layDownSet;
module.exports.layDownCard = layDownCard;
module.exports.discardCard = discardCard;
module.exports.filterGameStateForUser = filterGameStateForUser;
module.exports.checkWinnerCondition = checkWinnerCondition;
module.exports.isSetValid = isSetValid;
module.exports.isCardValidForDropPile = isCardValidForDropPile;
module.exports.check3OfAKind = check3OfAKind;


