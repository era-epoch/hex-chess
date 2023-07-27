import bodyParser from 'body-parser';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { JoinGameEvent } from './websockets/events';
import { handleCreateGame, handleDisconnect, handleJoinGame } from './websockets/handlers';

const env = process.env.NODE_ENV;

console.log(`Server running in ${env} mode!`);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', handleDisconnect);
  socket.on('createGame', () => handleCreateGame(socket));
  socket.on('joinGame', (event: JoinGameEvent) => handleJoinGame(io, socket, event.roomId));
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
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
