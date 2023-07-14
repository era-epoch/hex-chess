import bodyParser from 'body-parser';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import path from 'path';
// import { Server } from 'socket.io';

const app = express();

const env = process.env.NODE_ENV;

console.log(`Server running in ${env} mode!`);

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

const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// });
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
