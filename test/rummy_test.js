const expect = require('chai').expect;

const rummy = require('../games/rummy');
const deckConstructor = require('../games/deck');

describe('Rummy', () => {
  let deck;
  let gameState;
  let cards_in_discard;
  let cards_in_hand;
  const host_id = 1;
  const guest_id = 2;
  const card_id = 13;
  beforeEach(() => {
    deck = deckConstructor.getDeck();
    gameState = {
      deck: deck,
      host: 1,
      guest: 2,
      discard: [],
      drop_pile: [],
      hands: [[], []],
      finished: false
    };
  });
  describe('Start of the game', () => {
    describe('#startGame(deck, host_id, guest_id)', () => {
      it('should give me an object with the two players hands, a drop pile, a shuffled deck and the game finished to false', () => {
        expect(rummy.startGame(deck, host_id, guest_id)).to.deep.equal(gameState);
      })
    });
  });

  describe('Play options', () => {
    describe('getMoves(gameState, user_id, first_move)', () => {
      let moves;
      let first_move;
      describe('initial moves', () => {
        beforeEach(() => {
          first_move = true;
        });
        it('should enable draw button in the begining of the turn', () => {
          expect(rummy.getMoves(gameState, host_id, first_move).draw).to.eq('');
        });
        it('should enable draw from discard button in the begining of the turn', () => {
          expect(rummy.getMoves(gameState, host_id, first_move).take_top).to.eq('');
        });
        it('should enable draw all cards from discard button in the begining of the turn', () => {
          expect(rummy.getMoves(gameState, host_id, first_move).take_all).to.eq('');
        });
        it('should disable drop card button in the begining of the turn', () => {
          expect(rummy.getMoves(gameState, host_id, first_move).attach_one).to.eq('disabled');
        });
        it('should disable drop set card button in the begining of the turn', () => {
          expect(rummy.getMoves(gameState, host_id, first_move).drop_set).to.eq('disabled');
        });
        it('should disable discard card button in the begining of the turn', () => {
          expect(rummy.getMoves(gameState, host_id, first_move).discard).to.eq('disabled');
        });
      });
      describe('second moves', () => {
        beforeEach(() => {
          first_move = false;
        });
        it('should disable draw button in the middle of the turn', () => {
          expect(rummy.getMoves(gameState, host_id, first_move).draw).to.eq('disabled');
        });
        it('should disable draw from discard button in the middle of the turn', () => {
          expect(rummy.getMoves(gameState, host_id, first_move).take_top).to.eq('disabled');
        });
        it('should disable draw all cards from discard button in the middle of the turn', () => {
          expect(rummy.getMoves(gameState, host_id, first_move).take_all).to.eq('disabled');
        });
        it('should enable discard card button', () => {
          expect(rummy.getMoves(gameState, host_id, first_move).discard).to.eq('');
        });
        describe('player\'s hand passes the check3OfAKind check', () => {
          beforeEach(() => {
            gameState.hands = [[[1,2,2],[1,1,4], [1,3,9]], []];
            gameState.drop_pile = [[1,1,1], [2,3,4], [1,2,6], [1,3,4], [2,2,6], [2,1,4]];
          });
          it('should enable drop card button if the game state passes the check3OfAKind with the discard pile', () => {
            expect(rummy.getMoves(gameState, host_id, first_move).attach_one).to.eq('');
          });
           it('should enable drop set card button if the game state passes the check3OfAKind with the player\'s hand', () => {
            expect(rummy.getMoves(gameState, host_id, first_move).drop_set).to.eq('');
          });
        });
        describe('player\'s hand does not pass the check3OfAKind check', () => {
          beforeEach(() => {
            gameState.hands = [[[1,2,2],[1,1,4], [2,3,9]], []];
          });
          it('should disable drop card button if the game state does not pass the check3OfAKind with the discard pile', () => {
            expect(rummy.getMoves(gameState, host_id, first_move).attach_one).to.eq('disabled');
          });
          it('should disable drop set card button if the game state does not pass the check3OfAKind with the player\'s hand', () => {
            expect(rummy.getMoves(gameState, host_id, first_move).drop_set).to.eq('disabled');
          });
        });
      });
    });
  });

  describe('User moves', () => {
    beforeEach(() => {
      cards_in_discard = gameState.discard.length;
      cards_in_hand = gameState.hands[0].length;
    });
    describe('start turn moves', () => {
      describe('#drawCard(gameState, user_id, init)', () => {
        it('should not do anything if is a finished game', () => {
          gameState.finished = true;
          expect(rummy.drawCard(gameState, host_id, true)).to.deep.equal(gameState);
        });
        it('should add 6 cards to the host if this is the first round init = true', () => {
          expect(rummy.drawCard(gameState, host_id, true).hands[0].length).to.eq(6);
        });
        it('should add 5 cards to the guest if this is the first round init = true', () => {
          expect(rummy.drawCard(gameState, host_id, true).hands[1].length).to.eq(5);
        });
        it('should remove 11 cards form the deck if is the first round init = true', () => {
          expect(rummy.drawCard(gameState, host_id, true).deck.length).to.eq(41);
        });
        it('should add a card to the host hand in his/her move if not the first round init = false', () => {
          expect(rummy.drawCard(gameState, host_id, false).hands[0].length).to.eq(1);
        });
        it('should add a card to the guest hand in his/her move if not the first round init = false', () => {
          expect(rummy.drawCard(gameState, guest_id, false).hands[1].length).to.eq(1);
        });
        it('should remove a card form the deck if is not the first round init = false', () => {
          expect(rummy.drawCard(gameState, guest_id, false).deck.length).to.eq(51);
        });
      });
      describe('#drawCardFromDiscard(gameState, user_id)', () => {
        it('should not do anything if is a finished game', () => {
          gameState.finished = true;
          expect(rummy.drawCardFromDiscard(gameState, host_id)).to.deep.equal(gameState);
        });
        it('should not let a player draw a card if the discard pile is empty', () => {
           expect(rummy.drawCardFromDiscard(gameState, host_id)).to.deep.equal(gameState);
        });
        it('should add a card to the player\'s hand', () => {
          const cards_in_hand = gameState.hands[0].length;
          expect(rummy.drawCardFromDiscard(gameState, host_id).hands[0].length).to.eq(cards_in_hand + 1);
        });
        it('should remove the last card from the discard pile', () => {
          const cards_in_discard = gameState.discard.length;
          expect(rummy.drawCardFromDiscard(gameState, host_id).discard.length).to.eq(cards_in_discard);
        });
      });
      describe('#drawAllCardsFromDiscard(gameState, user_id)', () => {
        it('should not do anything if is a finished game', () => {
          gameState.finished = true;
        });
        it('should not let a player take all pile if there is only one card in the discard pile', () => {
          gameState.discard = [[1,2,3]];
          expect(rummy.drawAllCardsFromDiscard(gameState, host_id)).to.deep.equal(gameState);
        });
        it('should add all discarded cards to the player\'s hand', () => {
          gameState.discard = [[1,2,4], [3,2,1], [6,5,4]];
          cards_in_discard = gameState.discard.length;
          expect(rummy.drawAllCardsFromDiscard(gameState, host_id).hands[0].length).to.eq(cards_in_discard + cards_in_hand);
        });
        it('should empty the discard pile', () => {
          gameState.discard = [[1,2,4], [3,2,1], [6,5,4]];
          expect(rummy.drawAllCardsFromDiscard(gameState, host_id).discard).to.be.empty;
        });
      });
    });
    describe('mid turn moves', () => {
      describe('#layDownSet(gameState, user_id)', () => {
        it('should not do anything if is a finished game', () => {
          gameState.finished = true;
          expect(rummy.layDownSet(gameState, host_id)).to.deep.equal(gameState);
        });
        it('should not do anything if is not a valid set', () => {
          gameState.hands = [[[3,2,2],[3,3,8],[2,4,6]], []];
          gameState.drop_pile = [];
          expect(rummy.layDownSet(gameState, host_id).drop_pile).to.be.empty;
        });
        it('should remove the valid set from the user\'s hand', () => {
          gameState.hands = [[[3,2,2],[3,3,8],[3,4,6]], []];
          expect(rummy.layDownSet(gameState, host_id).hands[0]).to.be.empty;
        });
        it('should add the valid set to the drop pile', () => {
          gameState.hands = [[[3,2,2],[3,3,8],[3,4,6]], []];
          gameState.drop_pile = [];
          expect(rummy.layDownSet(gameState, host_id).drop_pile).to.deep.equal([[3,2,2],[3,3,8],[3,4,6]]);
        });
      });
      describe('#layDownCard(gameState, user_id,)', () => {
        it('should not do anything if is a finished game', () => {
          gameState.finished = true;
          expect(rummy.layDownCard(gameState, host_id)).to.deep.equal(gameState);
        });
        it('should not do anything if is not a valid card for a set in the drop pile', () => {
          gameState.hands = [[[1,2,2], [2,3,9]], []];
          gameState.drop_pile = [[3,2,2],[3,3,8],[3,4,6]];
          expect(rummy.layDownCard(gameState, host_id)).to.deep.equal(gameState);
        });
        it('should remove the valid card from the user\'s hand', () => {
          gameState.hands = [[[1,2,2],[3,1,4], [2,3,9]], []];
          gameState.drop_pile = [[3,2,2],[3,3,8],[3,4,6]];
          expect(rummy.layDownCard(gameState, host_id).hands[0]).to.deep.equal([[1,2,2],[2,3,9]]);
        });
        it('should add the the valid card to the drop pile set', () => {
          gameState.hands = [[[1,2,2],[3,1,4], [2,3,9]], []];
          gameState.drop_pile = [[3,2,2],[3,3,8],[3,4,6]];
          expect(rummy.layDownCard(gameState, host_id).drop_pile).to.deep.equal([[3,2,2],[3,3,8],[3,4,6],[3,1,4]]);
        });
      });
      describe('#discardCard(gameState, user_id, card_id)', () => {
        it('should not do anything if is a finished game', () => {
          gameState.finished = true;
          expect(rummy.discardCard(gameState, host_id, card_id)).to.deep.equal(gameState);
        });
        it('should not do anything if the player have not the card in his/her hand', () => {
          gameState.hands = [[[1,2,2],[1,1,4], [2,3,9]], []];
          expect(rummy.discardCard(gameState, host_id, card_id)).to.deep.equal(gameState);
        });
        it('should remove the valid card from the user\'s hand', () => {
          gameState.hands = [[[1,2,2],[1,1,4], [2,3,13]], []];
          expect(rummy.discardCard(gameState, host_id, card_id).hands[0]).to.deep.equal([[1,2,2],[1,1,4]]);
        });
        it('should add the valid card to the discard pile', () => {
          gameState.hands = [[[1,2,2],[1,1,4], [2,3,13]], []];
          expect(rummy.discardCard(gameState, host_id, card_id).discard).to.deep.equal([[2,3,13]]);
        });
      });
    })
  });

  describe('Game visibility', () => {
    describe('#filterGameStateForUser(gameState, user_id)', () => {
      it('should show the user\'s hand', () => {
        gameState.hands = [[[1,1,1], [2,3,4]], [[3,4,5], [6,7,8]]];
        expect(rummy.filterGameStateForUser(gameState, host_id).hand).to.deep.equal([[1,1,1], [2,3,4]]);
      });
      it('should not show the other player\'s hand to the player', () => {
        gameState.hands = [[[1,1,1]], [[3,4,5], [6,7,8]]];
        expect(rummy.filterGameStateForUser(gameState, host_id).opponent_hand).to.eq(2);
      });
      it('should show an empty array as a discard pile if there is no discard pile', () => {
        expect(rummy.filterGameStateForUser(gameState, host_id).discard).to.be.empty;
      });
      it('should show the last card of the discard pile to the player', () => {
        gameState.discard = [[1,1,1], [2,3,4]];
        expect(rummy.filterGameStateForUser(gameState, host_id).discard).to.deep.equal([2,3,4]);
      });
      it('should not show the deck to the player', () => {
        expect(rummy.filterGameStateForUser(gameState, host_id).deck).to.not.instanceof(Array);
      });
      it('should show the deck length to the player', () => {
        expect(rummy.filterGameStateForUser(gameState, host_id).deck).to.be.a('number');
      });
      it('should show the grouped drop pile to the player', () => {
        gameState.drop_pile = [[1,1,1], [2,3,4], [1,2,6], [1,3,4], [2,2,6], [2,1,4]];
        expect(rummy.filterGameStateForUser(gameState, host_id).drop_pile).to.deep.equal([[[1,1,1], [1,2,6], [1,3,4]], [[2,3,4], [2,2,6], [2,1,4]]]);
      })
    });
  });

  describe('Check functions', () => {
    describe('#isSetValid(set, rank)', () => {
      it('should return true if the pile has that rank', () => {
        const set = [[5,2,3], [5,1,6], [5,3,4],[9,4,0]];
        const rank = 5;
        expect(rummy.isSetValid(set, rank)).to.be.true;
      });
      it('should return false if the pile does not have that rank', () => {
        const set = [[5,2,3], [5,1,6], [9,3,4],[9,4,0]];
        const rank = 5;
        expect(rummy.isSetValid(set, rank)).to.be.false;
      });
    });
    describe('#check3OfAKind(gameState, user_id)', () => {
      it('should return true if the hand has 3 cards with the same rank', () => {
        gameState.hands = [[[1,2,2],[1,1,4], [1,3,9]], []];
        expect(rummy.check3OfAKind(gameState.hands[0])).to.be.true;
      });
      it('should return true if the hand has 4 cards with the same rank', () => {
        gameState.hands = [[[1,2,2],[1,1,4], [1,3,9], [1,4,6]], []];
        expect(rummy.check3OfAKind(gameState.hands[0])).to.be.true;
      });
      it('should return false if the hand has no rank with 3 cards', () => {
        gameState.hands = [[[1,2,2],[1,1,4], [2,3,9], [2,4,6]], []];
        expect(rummy.check3OfAKind(gameState.hands[0])).to.be.false;
      });
    });
    describe('#checkWinnerCondition(gameState, user_id)', () => {
      it('should return true if the user has one card left in his/her hand', () => {
        gameState.hands = [[[1,1,1]], [[3,4,5], [6,7,8]]];
        expect(rummy.checkWinnerCondition(gameState, host_id)).to.be.true;
      });
      it('should return true if the user has no cards left in his/her hand', () => {
        gameState.hands = [[], [[3,4,5], [6,7,8]]];
        expect(rummy.checkWinnerCondition(gameState, host_id)).to.be.true;
      });
      it('should return false if the user has more than one card left in his/her hand', () => {
        gameState.hands = [[[3,4,5], [6,7,8]], []];
        expect(rummy.checkWinnerCondition(gameState, host_id)).to.be.false;
      });
      it('should return true if the deck is empty and the user has less cards left than the opponent', () => {
        gameState.deck = [];
        gameState.discard = [];
        gameState.hands = [[[3,4,5], [2,3,4]], [[3,4,5], [6,7,8], [4,5,6]]];
        expect(rummy.checkWinnerCondition(gameState, host_id)).to.be.true;
      });
      it('should return false if the deck is empty and the user has more cards left than the opponent', () => {
        gameState.deck = [];
        gameState.discard = [];
        gameState.hands = [[[3,4,5], [6,7,8], [1,1,1]], [[3,4,5], [6,7,8]]];
        expect(rummy.checkWinnerCondition(gameState, host_id)).to.be.false;
      });
    });
  });
})
