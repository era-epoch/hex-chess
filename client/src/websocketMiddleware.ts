import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { Socket, io } from 'socket.io-client';
import {
  GameCreatedEvent,
  GameJoinedEvent,
  GameStartedEvent,
  JoinGameEvent,
  JoinGameFailedEvent,
  NewPlayerJoinedEvent,
  PlayerNameUpdatedEvent,
  PlayerSideUpdatedEvent,
  ReceiveMoveEvent,
  SendMoveEvent,
  StartGameEvent,
  UpdatePlayerNameEvent,
  UpdatePlayerSideEvent,
} from '../../websockets/events';
import {
  pushAlert,
  setActiveDialogue,
  setOnlineGameId,
  setOnlinePlayerId,
  setOpponentName,
  setPlayerSide,
} from './State/Slices/appSlice';
import { recieveOnlineMove, resetBoard, setLocalSide } from './State/Slices/gameSlice';
import { RootState } from './State/rootReducer';
import { IS_PROD } from './env';
import { AlertSeverity, Dialogue, PlayerSide, SerializedMove } from './types';
import { createAlert } from './utility';

export const wsConnect = () => ({ type: 'WS_CONNECT' });
export const wsDisconnect = () => ({ type: 'WS_DISCONNECT' });
export const wsCreateGame = () => ({ type: 'WS_CREATE_GAME' });
export const wsJoinGame = (roomId: string, playerName: string) => ({ type: 'WS_JOIN_GAME', roomId, playerName });
export const wsUpdateName = (playerName: string, playerId: string, roomId: string) => ({
  type: 'WS_UPDATE_NAME',
  playerName,
  playerId,
  roomId,
});
export const wsUpdateSide = (playerSide: PlayerSide, playerId: string, roomId: string) => ({
  type: 'WS_UPDATE_SIDE',
  playerSide,
  playerId,
  roomId,
});
export const wsStartGame = (roomId: string, creatorId: string, creatorSide: PlayerSide) => ({
  type: 'WS_START_GAME',
  roomId,
  creatorId,
  creatorSide,
});
export const wsSendMove = (roomId: string, move: SerializedMove) => ({ type: 'WS_SEND_MOVE', roomId, move });

const socketMiddleware: Middleware = (api: MiddlewareAPI) => {
  let socket: Socket | null = null;

  const connect = (action: any) => {
    if (socket !== null) {
      socket.close();
    }
    // Set up socket
    if (IS_PROD) {
      socket = io();
    } else {
      socket = io('localhost:5000');
    }
    socket.connect();

    /* Socket events */
    socket.on('gameCreated', (event: GameCreatedEvent) => {
      api.dispatch(setOnlineGameId(event.roomId));
      api.dispatch(setOnlinePlayerId(event.playerId));
      api.dispatch(setActiveDialogue(Dialogue.CreateGame));
    });

    socket.on('joinGameFailed', (event: JoinGameFailedEvent) => {
      api.dispatch(pushAlert(createAlert(`Join failed: ${event.reason}`, AlertSeverity.error)));
    });

    socket.on('gameJoined', (event: GameJoinedEvent) => {
      api.dispatch(setOnlineGameId(event.roomId));
      api.dispatch(setOnlinePlayerId(event.playerId));
      api.dispatch(pushAlert(createAlert('Joined game!', AlertSeverity.success)));
      api.dispatch(setActiveDialogue(Dialogue.GameLobby));
    });

    socket.on('newPlayerJoined', (event: NewPlayerJoinedEvent) => {
      api.dispatch(pushAlert(createAlert(`${event.playerName} has joined your game`, AlertSeverity.success)));
      api.dispatch(setOpponentName(event.playerName));
      // Push the current state of things to the newly-joined player
      const state: RootState = api.getState();
      api.dispatch(wsUpdateName(state.app.playerName, state.app.onlinePlayerId!, state.app.onlineGameId!));
      api.dispatch(wsUpdateSide(state.app.playerSide, state.app.onlinePlayerId!, state.app.onlineGameId!));
    });

    socket.on('playerNameUpdated', (event: PlayerNameUpdatedEvent) => {
      const state: RootState = api.getState();
      if (event.playerId !== state.app.onlinePlayerId) {
        api.dispatch(setOpponentName(event.playerName));
      }
    });

    socket.on('playerSideUpdated', (event: PlayerSideUpdatedEvent) => {
      const state: RootState = api.getState();
      if (event.playerId !== state.app.onlinePlayerId) {
        switch (event.playerSide) {
          case PlayerSide.black:
            api.dispatch(setPlayerSide(PlayerSide.white));
            break;
          case PlayerSide.white:
            api.dispatch(setPlayerSide(PlayerSide.black));
            break;
          case PlayerSide.random:
            api.dispatch(setPlayerSide(PlayerSide.random));
            break;
        }
      }
    });

    socket.on('gameStarted', (event: GameStartedEvent) => {
      const state: RootState = api.getState();
      api.dispatch(setActiveDialogue(Dialogue.none));
      api.dispatch(pushAlert(createAlert('Game Started', AlertSeverity.success)));
      api.dispatch(resetBoard());
      if (event.creatorId === state.app.onlinePlayerId) {
        api.dispatch(setLocalSide(event.creatorSide));
      } else {
        if (event.creatorSide === PlayerSide.black) {
          api.dispatch(setLocalSide(PlayerSide.white));
        } else {
          api.dispatch(setLocalSide(PlayerSide.black));
        }
      }
    });

    socket.on('receiveMove', (event: ReceiveMoveEvent) => {
      api.dispatch(recieveOnlineMove(event.move));
    });
  };

  return (next: Dispatch<AnyAction>) => (action: any) => {
    switch (action.type) {
      case 'WS_CONNECT':
        if (socket === null) connect(action);
        break;
      case 'WS_DISCONNECT':
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        break;
      case 'WS_CREATE_GAME':
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('createGame');
        break;
      case 'WS_JOIN_GAME':
        console.log('Attempting join:', action);
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('joinGame', action as JoinGameEvent);
        break;
      case 'WS_UPDATE_NAME':
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('updatePlayerName', action as UpdatePlayerNameEvent);
        break;
      case 'WS_UPDATE_SIDE':
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('updatePlayerSide', action as UpdatePlayerSideEvent);
        break;
      case 'WS_START_GAME':
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('startGame', action as StartGameEvent);
        break;
      case 'WS_SEND_MOVE':
        console.log('Sending Move');
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('sendMove', action as SendMoveEvent);
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware;
