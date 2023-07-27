import crypto from 'crypto';
import { Server, Socket } from 'socket.io';
import { GameCreatedEvent } from './events';
import { RoomExists } from './helpers';

export const handleDisconnect = () => {
  console.log('User disconnected');
};

export const handleCreateGame = (socket: Socket) => {
  console.log('Creating game');
  const newRoomId = crypto.randomBytes(8).toString('hex');
  const newPlayerId = crypto.randomBytes(8).toString('hex');
  socket.join(newRoomId);
  socket.emit('gameCreated', {
    roomId: newRoomId,
    playerId: newPlayerId,
  } as GameCreatedEvent);
};

export const handleJoinGame = (io: Server, socket: Socket, room: string) => {
  if (RoomExists(io, room)) {
    socket.join(room);
    socket.emit('joinedGame');
    socket.to(room).emit('playerJoined');
  } else {
    socket.emit('joinGameFailed');
  }
};
