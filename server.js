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

const io          =require('socket.io')(server);
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
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
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
  const data =  {
    deck: true,
    discard: 1,
    userhand: [7,8,9,10],
    oppHandCount: 5,
    userDiscard: [48, 47, 46],
    opponentDiscard: [52, 51, 50]
  };
  res.json(data);
});

app.get('/login/:id', (req, res) => {
 req.session.userid = req.params.id;
 res.redirect('/');
});

app.get('/game', function(req, res,next) {

   res.render("game1");
});

app.get('/game2', function(req, res,next) {
   res.sendFile(__dirname + '/public/game2.html');
});

server.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

const user1 = {
  deck: true,
  discard: 1,
  userhand: [2,3,4,5,6],
  oppHandCount: 4,
  userDiscard: [52,51,50],
  opponentDiscard: [48,47,46]
}

const user2 = {
  deck: true,
  discard: 1,
  userhand: [7,8,9,10],
  oppHandCount: 5,
  userDiscard: [48, 47, 46],
  opponentDiscard: [52, 51, 50]
}

const authUsers = {

}


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
  })
})
