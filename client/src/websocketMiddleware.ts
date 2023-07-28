import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { Socket, io } from 'socket.io-client';
import {
  ConnectEvent,
  GameCreatedEvent,
  GameJoinedEvent,
  JoinGameEvent,
  JoinGameFailedEvent,
  NewPlayerJoinedEvent,
} from '../../websockets/events';
import { pushAlert, setActiveDialogue, setOnlineGameId, setOnlinePlayerId } from './State/Slices/appSlice';
import { AlertSeverity, Dialogue } from './types';
import { createAlert } from './utility';

export const wsConnect = (url: string) => ({ type: 'WS_CONNECT', url });
export const wsDisconnect = (url: string) => ({ type: 'WS_DISCONNECT', url });
export const wsCreateGame = () => ({ type: 'WS_CREATE_GAME' });
export const wsJoinGame = (roomId: string, playerName: string) => ({ type: 'WS_JOIN_GAME', roomId, playerName });

const socketMiddleware: Middleware = (api: MiddlewareAPI) => {
  let socket: Socket | null = null;

  const connect = (action: any) => {
    if (socket !== null) {
      socket.close();
    }
    let connectAction = action as ConnectEvent;
    // Set up socket
    console.log(connectAction);
    socket = io(connectAction.url);
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
      api.dispatch(
        pushAlert(createAlert(`New player ${event.playerName} has joined your game`, AlertSeverity.success)),
      );
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
      default:
        return next(action);
    }
  };
};

export default socketMiddleware;
