import express = require('express');
import { Server, Socket } from "socket.io";
import http from "http";
import cors from "cors";
import type { playerType, ballMoveType, playerCollidedType } from "./players";

const { addPlayer, removePlayer, getPlayer, getPlayersInRoom, getNewVolleyBallData } = require('./players.ts');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Connect to WebSocket
io.on('connection', (socket: Socket) => {
  socket.on('join', ({name, room}, callback) => {
    const {error, player} = addPlayer({
      id: socket.id,
      name: name,
      room: room,
    });
    error && console.log("There is an error server side");
    if (error) return callback(error);

    socket.join(player.room);
    
    // Determine Player 1 or 2
    if (getPlayersInRoom(player.room).length == 1) {
      io.to(player.room).emit('roomData', {
        playerOne: player.name,
        playerTwo: null,
        room: room,
        numOfPlayers: 1
      });
    } else if (getPlayersInRoom(player.room).length == 2) {
      io.to(player.room).emit('roomData', {
        playerOne: getPlayersInRoom(player.room).filter(((p : playerType) => p.name != player.name))[0].name,
        playerTwo: player.name,
        room: room,
        numOfPlayers: 2
      });
    }
  });

  socket.on('sendMove', (message) => {
    const player = getPlayer(socket.id);
    io.to(player.room).emit('message', {
      player: player.name,
      move: message,
      numberOfPlayers: getPlayersInRoom(player.room).length,
    });
  });

  socket.on('sendBallMove', ({ballMove, playerCollided} : {ballMove: ballMoveType, playerCollided: playerCollidedType}) => {
    const player = getPlayer(socket.id);
    if (ballMove && playerCollided && player.name == playerCollided.name) {
      const ballData = getNewVolleyBallData(ballMove, playerCollided);
      io.to(player.room).emit('ballMove', {
        x: ballData.x,
        y: ballData.y,
        dx: ballData.dx,
        dy: ballData.dy,
      });
    }
  });

  socket.on('sendRestartGame', () => {
    const player = getPlayer(socket.id);
    io.to(player.room).emit('restartGame');
  });

  socket.on('disconnected', () => {
    removePlayer(socket.id);
    console.log("connection has been disconnected!");
  })
});

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

