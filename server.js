'use strict';

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.NODE_ENV || 'development';
const express     = require('express');
const bodyParser  = require('body-parser');
const sass        = require('node-sass-middleware');
const app         = express();
const server      = require('http').createServer(app);
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const cookieSession = require('cookie-session');
const io          = require('socket.io')(server);
const deckConstructor = require ('./games/deck.js');
const rummy = require('./games/rummy.js');

let morgan;
let knexLogger;
if(process.env.NODE_ENV === 'development'){
  morgan      = require('morgan');
  knexLogger  = require('knex-logger');
}


const sessionMiddleware = cookieSession({
  name: 'session',
  keys: ['Lighthouse'],
  maxAge: 24 * 60 * 60 * 1000
});

app.use(sessionMiddleware);

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
  app.use(knexLogger(knex));
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/styles', sass({
  src: __dirname + '/styles',
  dest: __dirname + '/public',
  outputStyle: 'expanded',
  prefix: '/styles',
  force: true
}));
app.use(express.static('public'));

// Home page
app.get('/', (req, res) => {
  let username = null;
  let user_id = 0;
  if(req.session.userid){
    username = req.session.username;
    user_id = req.session.userid;
  }
  let number;
  let wins;
  let games = {};
  knex.raw('SELECT COUNT(*) from sessions where user_id = ?', [user_id])
  .then((result) => {
    number = result.rows[0].count;
    return  knex.raw('SELECT COUNT(*) from matches where winner_id = ?', [user_id])
  }).then((result) => {
    wins = result.rows[0].count;
    return  knex('games').select('*')
  }).then((rows) => {
        if(rows){
          games = rows;
          res.render('index', {username: username, games: games, number: number, wins: wins});
        } else {
          return Promise.reject({
            type: 409,
            message: 'no games'
          });
        }
  }).catch((error) => {
    console.log(error.toString());
  })
});


// knex.select(knex.raw('COUNT(*) AS games, SUM(CASE WHEN matches.winner_id = ? THEN 1 ELSE 0 END) AS wins', [1]))
// .from('sessions').leftJoin('matches', 'sessions.match_id', 'matches.id')
// .where('sessions.user_id', 1).then((row) => {
//   console.log(row);
// }).catch((error) => {
//   console.log(error.toString());
// });



app.get('/login/:id', (req, res) => {
  knex('users')
      .select('*')
      .where({id: req.params.id}).then((rows) => {
        if(rows[0]){
          const user = rows[0];
          req.session.userid = user.id;
          req.session.locale = user.locale;
          req.session.username = user.name;
          req.session.locale = user.locale;
          res.redirect('/');
        } else {
          return Promise.reject({
            type: 409,
            message: 'bad credentials'
          });
        }
      }).catch((error) => {
        res.redirect('/');
      });
});

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });

app.get('/game', function(req, res) {
  if(players.host.id && players.guest.id){
    res.redirect('/');
    return;
  }
  res.render('game');
});


// TEST CSS ONLY


app.get('/test', function(req, res) {
  if(players.host.id && players.guest.id){
    res.redirect('/');
    return;
  }
  res.render("Css-test", user2);
});




  const user2 = {
    deck: 30,
    discard: [1, 0, 1],
    userhand: [[1, 3, 7], [1, 3, 8], [2, 3, 9], [3, 3, 10], [4, 3, 8], [5, 3, 9], [6, 3, 10], [7, 3, 8], [8, 3, 9], [9, 3, 10], [10, 0, 8], [11, 0, 9], [12, 0, 10],
               [0, 1, 7], [1, 1, 8], [2, 1, 9], [3, 1, 11], [4, 1, 8], [5, 1, 9], [6, 1, 11], [7, 1, 8], [8, 1, 9], [9, 1, 11], [10, 1, 8], [11, 1, 9]],
    oppHandCount: 5,
    dropPile: [[13, 4, 52], [13, 3, 51], [13, 2, 50]],
    availablePlays: {
      draw: 0,
      takeTop: 0,
      takeAll: 0,
      drop3: 0,
      drop1: 0,
      discard: 0
    }
  };







app.get('/about', function(req, res, next) {
  res.render('about');
});

app.get('/about/shuffle1', function(req, res, next) {
  res.render('shuffle1');
});

app.get('/about/shuffle2', function(req, res, next) {
  res.render('shuffle2');
});

server.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});

function userID(socketid) { return players.host.socket.id === socketid ? players.host.id : players.guest.id; }
function oppID (socketid) { return players.host.socket.id === socketid ? players.guest.id : players.host.id; }
function userSocket (socketid) { return players.host.socket.id === socketid ? players.host.socket : players.guest.socket;}
function oppSocket (socketid) { return players.host.socket.id === socketid ? players.guest.socket : players.host.socket;}
function resetPlayer(obj) { obj.id = null; obj.socket = null}
function userState(socketid) {return players.host.socket.id === socketid ? players.host.state : players.guest.state;}
function oppState (socketid) { return players.host.socket.id === socketid ? players.guest.state : players.host.state; }
function userHostGuest (socketid) {return players.host.socket.id === socketid ? 'host' : 'guest'}
function oppHostGuest (socketid) {return players.host.socket.id === socketid ? 'guest' : 'host'}
function insertMatchInfo () {
  knex('matches').insert({game_id: 1, winner_id: players.host.id}, 'id').then((id) => {
    if(id){
      players.match = Number(id);
      return knex('sessions').insert({user_id: players.host.id, match_id: Number(id)}, 'match_id');
    }else{
      return Promise.reject({
        type: 409,
        message: 'match insert failed'
      });
    }
  }).then((id) => {
    return knex('sessions').insert({user_id: players.guest.id, match_id: Number(id)}, 'match_id');
  }).catch((error) => {
     console.log(error.toString());
  });
}

function insertWinner (match, winner){
  knex('matches')
  .where('match_id', '=', match)
  .update({
    winner_id: winner
  })
}


let gameState;

const players = {
  host: {
    id: null,
    socket: null,
    username: null
  },
  guest: {
    id: null,
    socket: null,
    username: null
  },
  match : null
};

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

const game = io.of('/game');

game.on('connection', function(socket) {
  socket.on('add user', function(socketid) {
    if (players.host.socket === null) {
      players.host.socket = socket;
      players.host.id = socket.request.session.userid;
    } else if (players.host.socket && players.guest.socket === null) {
      players.guest.socket = socket;
      players.guest.id = socket.request.session.userid;
      insertMatchInfo();
      game.emit('game ready');
      const deck = deckConstructor.getDeck();
      gameState = rummy.startGame(deck, players.host.id, players.guest.id);
      gameState = rummy.drawCard(gameState,players.host.id, true);
      const hostView = rummy.filterGameStateForUser(gameState, players.host.id);
      hostView.moves = rummy.getMoves(gameState, players.host.id, false);
      const guestView = rummy.filterGameStateForUser(gameState, players.guest.id);
      setTimeout(() => { players.host.socket.emit('start game', hostView)}, 5000);
      setTimeout(() => { players.guest.socket.emit('start game', guestView)}, 5000);
      setTimeout(() => { players.guest.socket.emit('waitTurn', guestView)}, 5000);
    }

  });
  socket.on('disconnect', () =>{
    if (players.host.socket && socket.id === players.host.socket.id ){
      insertWinner (players.match, players.guest.id);
      resetPlayer(players.host);
      socket.broadcast.emit('winner', players.guest.id);
    } else if (players.guest.socket && socket.id === players.guest.socket.id) {
      insertWinner (players.match, players.host.id);
      resetPlayer(players.guest);
      socket.broadcast.emit('winner', players.host.id);
    }
  });

  socket.on('draw', (socketid)=> {
    const playerId = userID(socketid);
    const opponentId = oppID(socketid);
    gameState = rummy.drawCard(gameState, playerId, false);
    const playerMoves = rummy.getMoves(gameState, playerId);
    const playerView = rummy.filterGameStateForUser(gameState, playerId);
    playerView.moves = playerMoves;
    const oppView = rummy.filterGameStateForUser(gameState, opponentId);
    userSocket(socketid).emit('new state', playerView);
    oppSocket(socketid).emit('new state', oppView);
  });

  socket.on('takeTop', (socketid) => {
    const playerId = userID(socketid);
    const opponentId = oppID(socketid);
    gameState = rummy.drawCardFromDiscard(gameState, playerId);
    const playerMoves = rummy.getMoves(gameState, playerId);
    const playerView = rummy.filterGameStateForUser(gameState, playerId);
    playerView.moves = playerMoves;
    const oppView = rummy.filterGameStateForUser(gameState, opponentId);
    userSocket(socketid).emit('new state', playerView);
    oppSocket(socketid).emit('new state', oppView);
  });

  socket.on('takeAll', (socketid) => {
    const playerId = userID(socketid);
    const opponentId = oppID(socketid);
    gameState = rummy.drawAllCardsFromDiscard(gameState, playerId);
    const playerMoves = rummy.getMoves(gameState, playerId);
    const playerView = rummy.filterGameStateForUser(gameState, playerId);
    playerView.moves = playerMoves;
    const oppView = rummy.filterGameStateForUser(gameState, opponentId);
    userSocket(socketid).emit('new state', playerView);
    oppSocket(socketid).emit('new state', oppView);
  });

  socket.on('discard', (socketid, discardID) => {
    if(!discardID){
      userSocket(socketid).emit('selectCard', "Please select a card before discarding");
      return;
    }
    const playerId = userID(socketid);
    const opponentId = oppID(socketid);
    const hostGuest = userHostGuest(socketid) === 'host'? 0 : 1;
    gameState = rummy.discardCard(gameState, playerId, discardID);
    if(rummy.checkWinnerCondition(gameState, playerId, true)){
      userSocket(socketid).emit('winner');
      oppSocket(socketid).emit('loser');
      return; //update
    } else {
      const playerMoves = rummy.getMoves(gameState, playerId, false, true);
      const playerView = rummy.filterGameStateForUser(gameState, playerId);
      const oppView = rummy.filterGameStateForUser(gameState, opponentId);
      const oppMoves = rummy.getMoves(gameState, opponentId, true);
      userSocket(socketid).emit('new state', playerView);
      userSocket(socketid).emit('waitTurn');
      oppSocket(socketid).emit('new state', oppView);
      oppSocket(socketid).emit('startTurn');
    }
  });

  socket.on('dropSet', (socketid) => {
    const playerId = userID(socketid);
    const opponentId = oppID(socketid);
    gameState = rummy.layDownSet(gameState, playerId);

    if(rummy.checkWinnerCondition(gameState, playerId)){
      userSocket(socketid).emit('winner');
      oppSocket(socketid).emit('loser');
      return;
    } else {
      const playerMoves = rummy.getMoves(gameState, playerId);
      const playerView = rummy.filterGameStateForUser(gameState, playerId);
      playerView.moves = playerMoves;
      const oppView = rummy.filterGameStateForUser(gameState, opponentId);
      userSocket(socketid).emit('new state', playerView);
      oppSocket(socketid).emit('new state', oppView);
    }
  });

  socket.on('attachOne', (socketid) => {
    const playerId = userID(socketid);
    const opponentId = oppID(socketid);
    gameState = rummy.layDownCard(gameState, playerId);
    if(rummy.checkWinnerCondition(gameState, playerId)){
      userSocket(socketid).emit('winner');
      oppSocket(socketid).emit('loser');
    } else {
    const playerMoves = rummy.getMoves(gameState, playerId);
    const playerView = rummy.filterGameStateForUser(gameState, playerId);
    playerView.moves = playerMoves;
    const oppView = rummy.filterGameStateForUser(gameState, opponentId);
    userSocket(socketid).emit('new state', playerView);
    oppSocket(socketid).emit('new state', oppView);
    }
  })



});
