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
    userhand: [[11, 0, 7], [12, 1, 8], [0, 2, 9], [10, 3, 10]],
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


app.get('/game2', function(req, res, next) {
  res.sendFile(__dirname + '/public/game2.html');
});

server.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

const user1 = {
  deck: 30,
  discard: [1, 0, 1],
  userhand: [[1, 1, 2], [1, 2, 3], [1, 3, 4], [2, 0, 5], [2, 1, 6]],
  oppHandCount: 4,
  dropPile: [[13, 4, 52], [13, 3, 51], [13, 2, 50]],
  availablePlays: {
    draw: 0,
    takeTop: 0,
    takeAll: 0,
    drop3: 1,
    drop1: 1,
    discard: 1
  }
};

const user2 = {
  deck: 30,
  discard: [1, 0, 1],
  userhand: [[2, 2, 7], [2, 3, 8], [3, 0, 9], [3, 2, 10]],
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

app.get('/game', function(req, res, next) {
  res.render("game", user2);
});

app.get('/about', function(req, res, next) {
  res.render("about");
});

const authUsers = {

};


let connectedPlayers = {
  host: {
    id: null,
    socket: null
  },
  guest: {
    id: null,
    socket: null
  }
};

// var sessionMiddleware = cookieSession({
//   name: 'session',
//   keys: ['Lighthouse'],
//   maxAge: 24 * 60 * 60 * 1000
// });

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

const game1 = io.of('/game1');
game1.on('connection', function(socket) {
  socket.on('add user', function(username) {

    if (connectedPlayers.host.socket === null) {
      connectedPlayers.host.socket = socket.id;
      connectedPlayers.host.id = socket.request.session.userid;
    } else {
      connectedPlayers.guest.socket = socket.id;
      connectedPlayers.guest.id = socket.request.session.userid;
    }
    const connections = io.of('/game1').connected;

    if (connections) {
      if (connectedPlayers.host.socket) {
        const host = connections[connectedPlayers.host.socket];
        if (host) {
          host.emit('game object', `you are the host with userid ${connectedPlayers.host.id} and ${connectedPlayers.host.socket}`);
        }
      }

      if (connectedPlayers.guest.socket) {
        connections[connectedPlayers.guest.socket].emit('game object', `you are the guest with userid ${connectedPlayers.guest.id} and ${connectedPlayers.guest.socket}`);

      }
    }

  });
});

const game2 = io.of('/game2');
game2.on('connection', function(socket) {
  socket.on('add user', function(username){
    console.log(`Welcome to game 2 ${username}`);
    socket.emit('game object', JSON.stringify(testObj2));
  });
});
