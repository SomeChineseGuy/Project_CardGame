# TOC
   - [Rummy](#rummy)
     - [Start of the game](#rummy-start-of-the-game)
       - [#startGame(deck, host_id, guest_id)](#rummy-start-of-the-game-startgamedeck-host_id-guest_id)
     - [Play options](#rummy-play-options)
       - [getMoves(gameState, user_id, first_move)](#rummy-play-options-getmovesgamestate-user_id-first_move)
         - [initial moves](#rummy-play-options-getmovesgamestate-user_id-first_move-initial-moves)
         - [second moves](#rummy-play-options-getmovesgamestate-user_id-first_move-second-moves)
           - [player's hand passes the check3OfAKind check](#rummy-play-options-getmovesgamestate-user_id-first_move-second-moves-players-hand-passes-the-check3ofakind-check)
           - [player's hand does not pass the check3OfAKind check](#rummy-play-options-getmovesgamestate-user_id-first_move-second-moves-players-hand-does-not-pass-the-check3ofakind-check)
     - [User moves](#rummy-user-moves)
       - [start turn moves](#rummy-user-moves-start-turn-moves)
         - [#drawCard(gameState, user_id, init)](#rummy-user-moves-start-turn-moves-drawcardgamestate-user_id-init)
         - [#drawCardFromDiscard(gameState, user_id)](#rummy-user-moves-start-turn-moves-drawcardfromdiscardgamestate-user_id)
         - [#drawAllCardsFromDiscard(gameState, user_id)](#rummy-user-moves-start-turn-moves-drawallcardsfromdiscardgamestate-user_id)
       - [mid turn moves](#rummy-user-moves-mid-turn-moves)
         - [#layDownSet(gameState, user_id)](#rummy-user-moves-mid-turn-moves-laydownsetgamestate-user_id)
         - [#layDownCard(gameState, user_id,)](#rummy-user-moves-mid-turn-moves-laydowncardgamestate-user_id)
         - [#discardCard(gameState, user_id, card_id)](#rummy-user-moves-mid-turn-moves-discardcardgamestate-user_id-card_id)
     - [Game visibility](#rummy-game-visibility)
       - [#filterGameStateForUser(gameState, user_id)](#rummy-game-visibility-filtergamestateforusergamestate-user_id)
     - [Check functions](#rummy-check-functions)
       - [#isSetValid(set, rank)](#rummy-check-functions-issetvalidset-rank)
       - [#check3OfAKind(gameState, user_id)](#rummy-check-functions-check3ofakindgamestate-user_id)
       - [#checkWinnerCondition(gameState, user_id)](#rummy-check-functions-checkwinnerconditiongamestate-user_id)
<a name=""></a>
 
<a name="rummy"></a>
# Rummy
<a name="rummy-start-of-the-game"></a>
## Start of the game
<a name="rummy-start-of-the-game-startgamedeck-host_id-guest_id"></a>
### #startGame(deck, host_id, guest_id)
should give me an object with the two players hands, a drop pile, a shuffled deck and the game finished to false.

```js
expect(rummy.startGame(deck, host_id, guest_id)).to.deep.equal(gameState);
```

<a name="rummy-play-options"></a>
## Play options
<a name="rummy-play-options-getmovesgamestate-user_id-first_move"></a>
### getMoves(gameState, user_id, first_move)
<a name="rummy-play-options-getmovesgamestate-user_id-first_move-initial-moves"></a>
#### initial moves
should enable draw button in the begining of the turn.

```js
expect(rummy.getMoves(gameState, host_id, first_move).draw).to.be.true;
```

should enable draw from discard button in the begining of the turn.

```js
expect(rummy.getMoves(gameState, host_id, first_move).take_top).to.be.true;
```

should enable draw all cards from discard button in the begining of the turn.

```js
expect(rummy.getMoves(gameState, host_id, first_move).take_all).to.be.true;
```

should disable drop card button in the begining of the turn.

```js
expect(rummy.getMoves(gameState, host_id, first_move).attach_one).to.be.false;
```

should disable drop set card button in the begining of the turn.

```js
expect(rummy.getMoves(gameState, host_id, first_move).drop_set).to.be.false;
```

should disable discard card button in the begining of the turn.

```js
expect(rummy.getMoves(gameState, host_id, first_move).discard).to.be.false;
```

<a name="rummy-play-options-getmovesgamestate-user_id-first_move-second-moves"></a>
#### second moves
should disable draw button in the middle of the turn.

```js
expect(rummy.getMoves(gameState, host_id, first_move).draw).to.be.false;
```

should disable draw from discard button in the middle of the turn.

```js
expect(rummy.getMoves(gameState, host_id, first_move).take_top).to.be.false;
```

should disable draw all cards from discard button in the middle of the turn.

```js
expect(rummy.getMoves(gameState, host_id, first_move).take_all).to.be.false;
```

should enable discard card button.

```js
expect(rummy.getMoves(gameState, host_id, first_move).discard).to.be.true;
```

<a name="rummy-play-options-getmovesgamestate-user_id-first_move-second-moves-players-hand-passes-the-check3ofakind-check"></a>
##### player's hand passes the check3OfAKind check
should enable drop card button if the game state passes the check3OfAKind with the discard pile.

```js
expect(rummy.getMoves(gameState, host_id, first_move).attach_one).to.be.true;
```

should enable drop set card button if the game state passes the check3OfAKind with the player's hand.

```js
expect(rummy.getMoves(gameState, host_id, first_move).drop_set).to.be.true;
```

<a name="rummy-play-options-getmovesgamestate-user_id-first_move-second-moves-players-hand-does-not-pass-the-check3ofakind-check"></a>
##### player's hand does not pass the check3OfAKind check
should disable drop card button if the game state does not pass the check3OfAKind with the discard pile.

```js
expect(rummy.getMoves(gameState, host_id, first_move).attach_one).to.be.false;
```

should disable drop set card button if the game state does not pass the check3OfAKind with the player's hand.

```js
expect(rummy.getMoves(gameState, host_id, first_move).drop_set).to.be.false;
```

<a name="rummy-user-moves"></a>
## User moves
<a name="rummy-user-moves-start-turn-moves"></a>
### start turn moves
<a name="rummy-user-moves-start-turn-moves-drawcardgamestate-user_id-init"></a>
#### #drawCard(gameState, user_id, init)
should not do anything if is a finished game.

```js
gameState.finished = true;
expect(rummy.drawCard(gameState, host_id, true)).to.deep.equal(gameState);
```

should add 6 cards to the host if this is the first round init = true.

```js
expect(rummy.drawCard(gameState, host_id, true).hands[0].length).to.eq(6);
```

should add 5 cards to the guest if this is the first round init = true.

```js
expect(rummy.drawCard(gameState, host_id, true).hands[1].length).to.eq(5);
```

should remove 11 cards form the deck if is the first round init = true.

```js
expect(rummy.drawCard(gameState, host_id, true).deck.length).to.eq(41);
```

should add a card to the host hand in his/her move if not the first round init = false.

```js
expect(rummy.drawCard(gameState, host_id, false).hands[0].length).to.eq(1);
```

should add a card to the guest hand in his/her move if not the first round init = false.

```js
expect(rummy.drawCard(gameState, guest_id, false).hands[1].length).to.eq(1);
```

should remove a card form the deck if is not the first round init = false.

```js
expect(rummy.drawCard(gameState, guest_id, false).deck.length).to.eq(51);
```

<a name="rummy-user-moves-start-turn-moves-drawcardfromdiscardgamestate-user_id"></a>
#### #drawCardFromDiscard(gameState, user_id)
should not do anything if is a finished game.

```js
gameState.finished = true;
expect(rummy.drawCardFromDiscard(gameState, host_id)).to.deep.equal(gameState);
```

should not let a player draw a card if the discard pile is empty.

```js
expect(rummy.drawCardFromDiscard(gameState, host_id)).to.deep.equal(gameState);
```

should add a card to the player's hand.

```js
const cards_in_hand = gameState.hands[0].length;
expect(rummy.drawCardFromDiscard(gameState, host_id).hands[0].length).to.eq(cards_in_hand + 1);
```

should remove the last card from the discard pile.

```js
const cards_in_discard = gameState.discard.length;
expect(rummy.drawCardFromDiscard(gameState, host_id).discard.length).to.eq(cards_in_discard);
```

<a name="rummy-user-moves-start-turn-moves-drawallcardsfromdiscardgamestate-user_id"></a>
#### #drawAllCardsFromDiscard(gameState, user_id)
should not do anything if is a finished game.

```js
gameState.finished = true;
```

should not let a player take all pile if there is only one card in the discard pile.

```js
gameState.discard = [[1,2,3]];
expect(rummy.drawAllCardsFromDiscard(gameState, host_id)).to.deep.equal(gameState);
```

should add all discarded cards to the player's hand.

```js
gameState.discard = [[1,2,4], [3,2,1], [6,5,4]];
cards_in_discard = gameState.discard.length;
expect(rummy.drawAllCardsFromDiscard(gameState, host_id).hands[0].length).to.eq(cards_in_discard + cards_in_hand);
```

should empty the discard pile.

```js
gameState.discard = [[1,2,4], [3,2,1], [6,5,4]];
expect(rummy.drawAllCardsFromDiscard(gameState, host_id).discard).to.be.empty;
```

<a name="rummy-user-moves-mid-turn-moves"></a>
### mid turn moves
<a name="rummy-user-moves-mid-turn-moves-laydownsetgamestate-user_id"></a>
#### #layDownSet(gameState, user_id)
should not do anything if is a finished game.

```js
gameState.finished = true;
expect(rummy.layDownSet(gameState, host_id)).to.deep.equal(gameState);
```

should not do anything if is not a valid set.

```js
gameState.hands = [[[3,2,2],[3,3,8],[2,4,6]], []];
gameState.drop_pile = [];
expect(rummy.layDownSet(gameState, host_id).drop_pile).to.be.empty;
```

should remove the valid set from the user's hand.

```js
gameState.hands = [[[3,2,2],[3,3,8],[3,4,6]], []];
expect(rummy.layDownSet(gameState, host_id).hands[0]).to.be.empty;
```

should add the valid set to the drop pile.

```js
gameState.hands = [[[3,2,2],[3,3,8],[3,4,6]], []];
gameState.drop_pile = [];
expect(rummy.layDownSet(gameState, host_id).drop_pile).to.deep.equal([[3,2,2],[3,3,8],[3,4,6]]);
```

<a name="rummy-user-moves-mid-turn-moves-laydowncardgamestate-user_id"></a>
#### #layDownCard(gameState, user_id,)
should not do anything if is a finished game.

```js
gameState.finished = true;
expect(rummy.layDownCard(gameState, host_id)).to.deep.equal(gameState);
```

should not do anything if is not a valid card for a set in the drop pile.

```js
gameState.hands = [[[1,2,2], [2,3,9]], []];
gameState.drop_pile = [[3,2,2],[3,3,8],[3,4,6]];
expect(rummy.layDownCard(gameState, host_id)).to.deep.equal(gameState);
```

should remove the valid card from the user's hand.

```js
gameState.hands = [[[1,2,2],[3,1,4], [2,3,9]], []];
gameState.drop_pile = [[3,2,2],[3,3,8],[3,4,6]];
expect(rummy.layDownCard(gameState, host_id).hands[0]).to.deep.equal([[1,2,2],[2,3,9]]);
```

should add the the valid card to the drop pile set.

```js
gameState.hands = [[[1,2,2],[3,1,4], [2,3,9]], []];
gameState.drop_pile = [[3,2,2],[3,3,8],[3,4,6]];
expect(rummy.layDownCard(gameState, host_id).drop_pile).to.deep.equal([[3,2,2],[3,3,8],[3,4,6],[3,1,4]]);
```

<a name="rummy-user-moves-mid-turn-moves-discardcardgamestate-user_id-card_id"></a>
#### #discardCard(gameState, user_id, card_id)
should not do anything if is a finished game.

```js
gameState.finished = true;
expect(rummy.discardCard(gameState, host_id, card_id)).to.deep.equal(gameState);
```

should not do anything if the player have not the card in his/her hand.

```js
gameState.hands = [[[1,2,2],[1,1,4], [2,3,9]], []];
expect(rummy.discardCard(gameState, host_id, card_id)).to.deep.equal(gameState);
```

should remove the valid card from the user's hand.

```js
gameState.hands = [[[1,2,2],[1,1,4], [2,3,13]], []];
expect(rummy.discardCard(gameState, host_id, card_id).hands[0]).to.deep.equal([[1,2,2],[1,1,4]]);
```

should add the valid card to the discard pile.

```js
gameState.hands = [[[1,2,2],[1,1,4], [2,3,13]], []];
expect(rummy.discardCard(gameState, host_id, card_id).discard).to.deep.equal([[2,3,13]]);
```

<a name="rummy-game-visibility"></a>
## Game visibility
<a name="rummy-game-visibility-filtergamestateforusergamestate-user_id"></a>
### #filterGameStateForUser(gameState, user_id)
should show the user's hand.

```js
gameState.hands = [[[1,1,1], [2,3,4]], [[3,4,5], [6,7,8]]];
expect(rummy.filterGameStateForUser(gameState, host_id).hand).to.deep.equal([[1,1,1], [2,3,4]]);
```

should not show the other player's hand to the player.

```js
gameState.hands = [[[1,1,1]], [[3,4,5], [6,7,8]]];
expect(rummy.filterGameStateForUser(gameState, host_id).opponent_hand).to.eq(2);
```

should show an empty array as a discard pile if there is no discard pile.

```js
expect(rummy.filterGameStateForUser(gameState, host_id).discard).to.be.empty;
```

should show the last card of the discard pile to the player.

```js
gameState.discard = [[1,1,1], [2,3,4]];
expect(rummy.filterGameStateForUser(gameState, host_id).discard).to.deep.equal([2,3,4]);
```

should not show the deck to the player.

```js
expect(rummy.filterGameStateForUser(gameState, host_id).deck).to.not.instanceof(Array);
```

should show the deck length to the player.

```js
expect(rummy.filterGameStateForUser(gameState, host_id).deck).to.be.a('number');
```

should show the grouped drop pile to the player.

```js
gameState.drop_pile = [[1,1,1], [2,3,4], [1,2,6], [1,3,4], [2,2,6], [2,1,4]];
expect(rummy.filterGameStateForUser(gameState, host_id).drop_pile).to.deep.equal([[[1,1,1], [1,2,6], [1,3,4]], [[2,3,4], [2,2,6], [2,1,4]]]);
```

<a name="rummy-check-functions"></a>
## Check functions
<a name="rummy-check-functions-issetvalidset-rank"></a>
### #isSetValid(set, rank)
should return true if the pile has that rank.

```js
const set = [[5,2,3], [5,1,6], [5,3,4],[9,4,0]];
const rank = 5;
expect(rummy.isSetValid(set, rank)).to.be.true;
```

should return false if the pile does not have that rank.

```js
const set = [[5,2,3], [5,1,6], [9,3,4],[9,4,0]];
const rank = 5;
expect(rummy.isSetValid(set, rank)).to.be.false;
```

<a name="rummy-check-functions-check3ofakindgamestate-user_id"></a>
### #check3OfAKind(gameState, user_id)
should return true if the hand has 3 cards with the same rank.

```js
gameState.hands = [[[1,2,2],[1,1,4], [1,3,9]], []];
expect(rummy.check3OfAKind(gameState.hands[0])).to.be.true;
```

should return true if the hand has 4 cards with the same rank.

```js
gameState.hands = [[[1,2,2],[1,1,4], [1,3,9], [1,4,6]], []];
expect(rummy.check3OfAKind(gameState.hands[0])).to.be.true;
```

should return false if the hand has no rank with 3 cards.

```js
gameState.hands = [[[1,2,2],[1,1,4], [2,3,9], [2,4,6]], []];
expect(rummy.check3OfAKind(gameState.hands[0])).to.be.false;
```

<a name="rummy-check-functions-checkwinnerconditiongamestate-user_id"></a>
### #checkWinnerCondition(gameState, user_id)
should return true if the user has one card left in his/her hand.

```js
gameState.hands = [[[1,1,1]], [[3,4,5], [6,7,8]]];
expect(rummy.checkWinnerCondition(gameState, host_id)).to.be.true;
```

should return true if the user has no cards left in his/her hand.

```js
gameState.hands = [[], [[3,4,5], [6,7,8]]];
expect(rummy.checkWinnerCondition(gameState, host_id)).to.be.true;
```

should return false if the user has more than one card left in his/her hand.

```js
gameState.hands = [[[3,4,5], [6,7,8]], []];
expect(rummy.checkWinnerCondition(gameState, host_id)).to.be.false;
```

should return true if the deck is empty and the user has less cards left than the opponent.

```js
gameState.deck = [];
gameState.discard = [];
gameState.hands = [[[3,4,5], [2,3,4]], [[3,4,5], [6,7,8], [4,5,6]]];
expect(rummy.checkWinnerCondition(gameState, host_id)).to.be.true;
```

should return false if the deck is empty and the user has more cards left than the opponent.

```js
gameState.deck = [];
gameState.discard = [];
gameState.hands = [[[3,4,5], [6,7,8], [1,1,1]], [[3,4,5], [6,7,8]]];
expect(rummy.checkWinnerCondition(gameState, host_id)).to.be.false;
```

