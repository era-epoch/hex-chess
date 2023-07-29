import crypto from 'crypto';
import { Server, Socket } from 'socket.io';
import {
  GameCreatedEvent,
  GameJoinedEvent,
  GameStartedEvent,
  JoinGameEvent,
  JoinGameFailedEvent,
  NewPlayerJoinedEvent,
  PlayerNameUpdatedEvent,
  PlayerSideUpdatedEvent,
  ReceiveChatEvent,
  ReceiveMoveEvent,
  SendChatEvent,
  SendMoveEvent,
  StartGameEvent,
  UpdatePlayerNameEvent,
  UpdatePlayerSideEvent,
} from './events';
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

export const handleJoinGame = (io: Server, socket: Socket, event: JoinGameEvent) => {
  const room = event.roomId;
  if (RoomExists(io, room)) {
    if (io.of('/').adapter.rooms.get(room).size >= 2) {
      socket.emit('joinGameFailed', { reason: 'Room is full' } as JoinGameFailedEvent);
      return;
    }
    const newPlayerId = crypto.randomBytes(8).toString('hex');
    socket.join(room);
    socket.emit('gameJoined', {
      roomId: room,
      playerId: newPlayerId,
    } as GameJoinedEvent);
    socket.to(room).emit('newPlayerJoined', {
      playerId: newPlayerId,
      playerName: event.playerName,
    } as NewPlayerJoinedEvent);
  } else {
    socket.emit('joinGameFailed', { reason: 'Room not found' } as JoinGameFailedEvent);
  }
};

export const handleUpdatePlayerName = (socket: Socket, event: UpdatePlayerNameEvent) => {
  socket.to(event.roomId).emit('playerNameUpdated', {
    playerId: event.playerId,
    playerName: event.playerName,
  } as PlayerNameUpdatedEvent);
};

export const handleUpdatePlayerSide = (socket: Socket, event: UpdatePlayerSideEvent) => {
  socket.to(event.roomId).emit('playerSideUpdated', {
    playerId: event.playerId,
    playerSide: event.playerSide,
  } as PlayerSideUpdatedEvent);
};

export const handleStartGame = (socket: Socket, event: StartGameEvent) => {
  socket.to(event.roomId).emit('gameStarted', {
    creatorSide: event.creatorSide,
    creatorId: event.creatorId,
  } as GameStartedEvent);
  socket.emit('gameStarted', {
    creatorSide: event.creatorSide,
    creatorId: event.creatorId,
  } as GameStartedEvent);
};

export const handleSendMove = (socket: Socket, event: SendMoveEvent) => {
  socket.to(event.roomId).emit('receiveMove', { move: event.move } as ReceiveMoveEvent);
};

export const handleSendChat = (socket: Socket, event: SendChatEvent) => {
  socket.to(event.roomId).emit('receiveChat', { item: event.item } as ReceiveChatEvent);
};
