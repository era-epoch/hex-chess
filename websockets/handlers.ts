import crypto from 'crypto';
import { Server, Socket } from 'socket.io';
import { PlayerSide } from '../client/src/types';
import { server_data } from '../main';
import {
  GameCreatedEvent,
  GameJoinedEvent,
  GameStartedEvent,
  JoinGameEvent,
  JoinGameFailedEvent,
  JoinRoomDirectEvent,
  MatchmadeGameJoinedEvent,
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
  server_data.population--;
};

export const RemoveSocketFromAllRooms = (socket: Socket) => {
  const currRooms = socket.rooms;
  currRooms.forEach((room) => {
    if (room != socket.id) {
      socket.leave(room);
    }
  });
};

export const handleFindGame = (socket: Socket) => {
  RemoveSocketFromAllRooms(socket);
  if (server_data.waiting.length >= 1) {
    const opponentId = server_data.waiting.pop();
    // There's somoene already waiting for a game
    const newRoomId = crypto.randomBytes(8).toString('hex');
    const player1Id = crypto.randomBytes(8).toString('hex');
    const player2Id = crypto.randomBytes(8).toString('hex');
    let player1Side = PlayerSide.black;
    let player2Side = PlayerSide.white;

    if (Math.random() > 0.5) {
      player1Side = PlayerSide.white;
      player2Side = PlayerSide.black;
    }

    socket.emit('matchmadeGameJoined', {
      gameId: newRoomId,
      playerId: player2Id,
      playerSide: player2Side,
    } as MatchmadeGameJoinedEvent);

    socket.to(opponentId).emit('matchmadeGameJoined', {
      gameId: newRoomId,
      playerId: player1Id,
      playerSide: player1Side,
    } as MatchmadeGameJoinedEvent);
  } else {
    server_data.waiting.push(socket.id);
    socket.emit('joinedQueue');
  }
};

export const handleCancelFindGame = (socket: Socket) => {
  // Remove socket from waiting queue
  server_data.waiting = server_data.waiting.filter((id) => id !== socket.id);
};

export const handleCreateGame = (socket: Socket) => {
  RemoveSocketFromAllRooms(socket);
  const newRoomId = crypto.randomBytes(8).toString('hex');
  const newPlayerId = crypto.randomBytes(8).toString('hex');
  socket.join(newRoomId);
  socket.emit('gameCreated', {
    roomId: newRoomId,
    playerId: newPlayerId,
  } as GameCreatedEvent);
};

export const handleJoinGame = (io: Server, socket: Socket, event: JoinGameEvent) => {
  RemoveSocketFromAllRooms(socket);
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

export const handleJoinRoomDirect = (socket: Socket, event: JoinRoomDirectEvent) => {
  // console.log('Joining room direct: ', event.roomId);
  socket.join(event.roomId);
};
