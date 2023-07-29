import bodyParser from 'body-parser';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import {
  JoinGameEvent,
  SendMoveEvent,
  StartGameEvent,
  UpdatePlayerNameEvent,
  UpdatePlayerSideEvent,
} from './websockets/events';
import {
  handleCreateGame,
  handleDisconnect,
  handleJoinGame,
  handleSendMove,
  handleStartGame,
  handleUpdatePlayerName,
  handleUpdatePlayerSide,
} from './websockets/handlers';

const env = process.env.NODE_ENV;

console.log(`Server running in ${env} mode!`);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', handleDisconnect);
  socket.on('createGame', () => handleCreateGame(socket));
  socket.on('joinGame', (event: JoinGameEvent) => handleJoinGame(io, socket, event));
  socket.on('updatePlayerName', (event: UpdatePlayerNameEvent) => handleUpdatePlayerName(socket, event));
  socket.on('updatePlayerSide', (event: UpdatePlayerSideEvent) => handleUpdatePlayerSide(socket, event));
  socket.on('startGame', (event: StartGameEvent) => handleStartGame(socket, event));
  socket.on('sendMove', (event: SendMoveEvent) => handleSendMove(socket, event));
});

// parse application/json
app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Fallback route
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Express server listening...
// const port = process.env.PORT || 5000;
const port = 8080;

console.log(process.env);

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
