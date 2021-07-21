import express = require('express');
import { Server, Socket } from "socket.io";
import http from "http";

const { addPlayer, removePlayer, getPlayer, getPlayersInRoom } = require('./players.ts');

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

    if (error) return callback(error);

    socket.join(player.room);

    callback();
  });

  socket.on('sendMove', (message, callback) => {
    const player = getPlayer(socket.id);

    io.to(player.room).emit('message', {
      player: player.name,
      move: message,
    });

    callback();
  });

  socket.on('disconnect', () => {
    console.log("connection has been disconnected!");
  })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

