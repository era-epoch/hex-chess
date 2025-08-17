import bodyParser from 'body-parser';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import {
  ConnectedEvent,
  JoinGameEvent,
  JoinRoomDirectEvent,
  SendChatEvent,
  SendMoveEvent,
  StartGameEvent,
  UpdatePlayerNameEvent,
  UpdatePlayerSideEvent,
} from './websockets/events';
import {
  handleCancelFindGame,
  handleCreateGame,
  handleDisconnect,
  handleFindGame,
  handleJoinGame,
  handleJoinRoomDirect,
  handleSendChat,
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

export interface ServerState {
  population: number;
  waiting: string[];
}

export const server_data: ServerState = {
  population: 0,
  waiting: [],
};

io.on('connection', (socket) => {
  server_data.population++;
  console.log('a user connected');
  // Set up handling functions for server socket
  socket.on('disconnect', handleDisconnect);
  socket.on('findGame', () => handleFindGame(socket));
  socket.on('cancelFindGame', () => handleCancelFindGame(socket));
  socket.on('createGame', () => handleCreateGame(socket));
  socket.on('joinGame', (event: JoinGameEvent) => handleJoinGame(io, socket, event));
  socket.on('updatePlayerName', (event: UpdatePlayerNameEvent) => handleUpdatePlayerName(socket, event));
  socket.on('updatePlayerSide', (event: UpdatePlayerSideEvent) => handleUpdatePlayerSide(socket, event));
  socket.on('startGame', (event: StartGameEvent) => handleStartGame(socket, event));
  socket.on('sendMove', (event: SendMoveEvent) => handleSendMove(socket, event));
  socket.on('sendChat', (event: SendChatEvent) => handleSendChat(socket, event));
  socket.on('joinRoomDirect', (event: JoinRoomDirectEvent) => handleJoinRoomDirect(socket, event));

  // Respond with 'connected' event
  socket.emit('connected', { population: server_data.population } as ConnectedEvent);
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
const port = process.env.PORT || 3000;

// console.log(process.env);

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
