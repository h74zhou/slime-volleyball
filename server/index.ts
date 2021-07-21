import express = require('express');
import { Server, Socket } from "socket.io";
import http from "http";

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
  console.log("we have a new connection!!");

  socket.on('join', ({name, room}, callback) => {


    // callback({error: 'error'});
  })

  socket.on('disconnect', () => {
    console.log("connection has been disconnected!");
  })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

