"use strict";

require('dotenv').config();


const PORT        = process.env.PORT || 8080;
const ENV         = process.env.NODE_ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const server      = require('http').createServer(app);
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const cookieSession = require('cookie-session');
const io          = require('socket.io')(server);
const deckConstructor = require ('../deck.js');
const rummy = require('../rummy.js');
// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

const sessionMiddleware = cookieSession({
  name: 'session',
  keys: ['Lighthouse'],
  maxAge: 24 * 60 * 60 * 1000
});

app.use(sessionMiddleware);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public",
  outputStyle: 'expanded',
  prefix: '/styles',
  force: true
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// TEST FOR TEMPLATE!!!!!!!!!!!!!!!!!!
app.get('/json', (req, res) => {
  const user2 = {
    deck: 30,
    discard: [1, 0, 1],
    userhand: [[0, 0, 7], [1, 0, 8], [2, 0, 9], [3, 0, 10], [4, 0, 8], [5, 0, 9]],
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
  res.json(user2);
});

app.get('/login/:id', (req, res) => {
  req.session.userid = req.params.id;
  res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });



server.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

const user1 = {
  deck: 30,
  discard: [1,0,1],
  userhand: [[1,1,2],[1,2,3],[1,3,4],[2,0,5],[2,1,6]],
  oppHandCount: 4,
  dropPile: [[13,4,52],[13,3,51],[13,2,50]],
  availablePlays: {
    draw: 0,
    takeTop: 0,
    takeAll: 0,
    drop3: 1,
    drop1: 1,
    discard: 1
  }
}


const user2 = {
  deck: 30,
  discard: [1, 0, 1],
  userhand: [[0, 0, 7], [1, 0, 8], [2, 0, 9], [3, 0, 10], [4, 0, 8], [5, 0, 9], [6, 0, 10], [7, 0, 8], [8, 0, 9], [9, 0, 10], [10, 0, 8], [11, 0, 9], [12, 0, 10],
               [0, 1, 7], [1, 1, 8], [2, 1, 9], [3, 1, 11], [4, 1, 8], [5, 1, 9], [6, 1, 11], [7, 1, 8], [8, 1, 9], [9, 1, 11], [10, 1, 8], [11, 1, 9], [12, 1, 10],
               [0, 2, 7], [1, 2, 8], [2, 2, 9], [3, 2, 12], [4, 2, 8], [5, 2, 9], [6, 2, 12], [7, 2, 8], [8, 2, 9], [9, 2, 12], [10, 2, 8], [11, 2, 9], [12, 2, 10],
               [0, 3, 7], [1, 3, 8], [2, 3, 9], [3, 3, 11], [4, 3, 8], [5, 3, 9], [6, 3, 11], [7, 3, 8], [8, 3, 9], [9, 3, 11], [10, 3, 8], [11, 3, 9], [12, 3, 10]],
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
}


app.get('/game', function(req, res) {
  if(players.host.id && players.guest.id){
    res.redirect('/');
    return;
  }
  res.render("game1", user2);
});

app.get('/about', function(req, res, next) {
  res.render("about");
});

app.get('/about/shuffle1', function(req, res, next) {
  res.render("shuffle1");
});

app.get('/about/shuffle2', function(req, res, next) {
  res.render("shuffle2");
});

const user = {
  deck: 40,
  discard: [1,0,1],
  userhand: [[1,1,2],[1,2,3],[1,3,4],[2,0,5],[2,1,6]],
  oppHandCount: 4,
  dropPile: [[13,4,52],[13,3,51],[13,2,50]],
  availablePlays: {
    draw: 0,
    takeTop: 0,
    takeAll: 0,
    drop3: 1,
    drop1: 1,
    discard: 1
  }
}

const opp = {
  deck: 50,
  discard: [1,0,1],
  userhand: [[2,2,7],[2,3,8],[3,0,9],[3,2,10]],
  oppHandCount: 5,
  dropPile: [[13,4,52],[13,3,51],[13,2,50]],
  availablePlays:{
    draw: 0,
    takeTop: 0,
    takeAll: 0,
    drop3: 0,
    drop1: 0,
    discard: 0
  }
}





function userID(socketid) { return players.host.socket.id === socketid ? players.host.id : players.guest.id; }
function oppID (socketid) { return players.host.socket.id === socketid ? players.guest.id : players.host.id; }
function userSocket (socketid) { return players.host.socket.id === socketid ? players.host.socket : players.guest.socket;}
function oppSocket (socketid) { return players.host.socket.id === socketid ? players.guest.socket : players.host.socket;}
function resetPlayer(obj) { obj.id = null; obj.socket = null}
function userState(socketid) {return players.host.socket.id === socketid ? players.host.state : players.guest.state;}
function oppState (socketid) { return players.host.socket.id === socketid ? players.guest.state : players.host.state; }
function userHostGuest (socketid) {return players.host.socket.id === socketid ? 'host' : 'guest'}
function oppHostGuest (socketid) {return players.host.socket.id === socketid ? 'guest' : 'host'}



const startGameState = rummy.startGame();
console.log(startGameState);
let prevGameState, gameState;

const players = {
  host: {
    id: null,
    socket: null,
  },
  guest: {
    id: null,
    socket: null,
  }
};

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

console.log('initial players------------------------', players);

const game1 = io.of('/game1');

game1.on('connection', function(socket) {
  socket.on('add user', function(socketid) {
    if (players.host.socket === null) {
      players.host.socket = socket;
      players.host.id = socket.request.session.userid;
      console.log('Host Joins --------------', players);
    } else if (players.host.socket && players.guest.socket === null) {
      players.guest.socket = socket;
      players.guest.id = socket.request.session.userid;
      console.log('GUEST JOINS ===============', players);
      game1.emit('game ready');
      const deck = deckConstructor.getDeck();
      console.log(deck);
      const startGameState = rummy.startGame(deck, players.host.id, players.guest.id);
      gameState = rummy.drawCard(startGameState,players.host.id, true);
      console.log('AM I HERE????==========', gameState);
      const hostView = rummy.filterGameStateForUser(gameState, players.host.id);
      console.log('===================HOST===============', hostView)
      const guestView = rummy.filterGameStateForUser(gameState, players.guest.id);
      console.log('=================GUEST================', guestView);

      setTimeout(() => { players.host.socket.emit('start game', hostView)}, 5000);
      setTimeout(() => { players.guest.socket.emit('start game', guestView)}, 5000);
      setTimeout(() => { players.guest.socket.emit('waitTurn', guestView)}, 5000);
    }

  });
  socket.on('disconnect', () =>{
    if (players.host.socket && socket.id === players.host.socket.id ){
      resetPlayer(players.host);
      socket.broadcast.emit('winner');
      console.log(players);
    } else if (players.guest.socket && socket.id === players.guest.socket.id) {
      resetPlayer(players.guest);
      socket.broadcast.emit('winner');
      console.log(players);
    }
  });
  socket.on('draw', (socketid)=> {

    const playerId = userID(socketid);
    const opponentId = oppID(socketid);
    gameState = rummy.drawCard(gameState, playerId, false);
    console.log(gameState);
    const playerView = rummy.filterGameStateForUser(gameState, playerId);
    const oppView = rummy.filterGameStateForUser(gameState, opponentId);
    userSocket(socketid).emit('new state', playerView);
    oppSocket(socketid).emit('new state', oppView);
  });

  socket.on('takeTop', (socketid) => {
    const playerId = userID(socketid);
    const opponentId = oppID(socketid);
    gameState = rummy.drawCardFromDiscard(gameState, playerId);
    const playerView = rummy.filterGameStateForUser(gameState, playerId);
    const oppView = rummy.filterGameStateForUser(gameState, opponentId);
    userSocket(socketid).emit('new state', playerView);
    oppSocket(socketid).emit('new state', oppView);
  });

  socket.on('takeAll', (socketid) => {
    const playerId = userID(socketid);
    const opponentId = oppID(socketid);
    gameState = rummy.drawAllCardsFromDiscard(gameState, playerId);
    const playerView = rummy.filterGameStateForUser(gameState, playerId);
    const oppView = rummy.filterGameStateForUser(gameState, opponentId);
    userSocket(socketid).emit('new state', playerView);
    oppSocket(socketid).emit('new state', oppView);
  });

  socket.on('discard', (socketid) => {
    const playerId = userID(socketid);
    const opponentId = oppID(socketid);
    gameState = rummy.discard(gameState, playerId);
    if(rummy.checkWinnerCondition(gameState, playerId)){
      userSocket(socketid).emit('winner');
      oppSocket(socketid).emit('loser');
      return; //update
    } else {
      const playerView = rummy.filterGameStateForUser(gameState, playerId);
      const oppView = rummy.filterGameStateForUser(gameState, opponentId);
      userSocket(socketid).emit('new state', playerView);
      userSocket(socketid).emit('waitTurn');
      oppSocket(socketid).emit('new state', oppView);
      oppSocket(socketid).emit('turnStart');
    }
  })


});

const game2 = io.of('/game2');
game2.on('connection', function(socket) {
  socket.on('add user', function(username){
    console.log(`Welcome to game 2 ${username}`);
    socket.emit('game object', JSON.stringify(testObj2));
  });
});
