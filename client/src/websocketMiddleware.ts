import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { Socket, io } from 'socket.io-client';
import { ConnectEvent, GameCreatedEvent } from '../../websockets/events';
import { setActiveDialogue, setOnlineGameId, setOnlinePlayerId } from './State/Slices/appSlice';
import { Dialogue } from './types';

export const wsConnect = (url: string) => ({ type: 'WS_CONNECT', url });
export const wsDisconnect = (url: string) => ({ type: 'WS_DISCONNECT', url });
export const wsCreateGame = () => ({ type: 'WS_CREATE_GAME' });
export const wsJoinGame = (gameId: string) => ({ type: 'WS_JOIN_GAME', gameId });

const socketMiddleware: Middleware = (api: MiddlewareAPI) => {
  let socket: Socket | null = null;

  const handleGameCreated = (event: GameCreatedEvent) => {
    api.dispatch(setOnlineGameId(event.roomId));
    api.dispatch(setOnlinePlayerId(event.playerId));
    api.dispatch(setActiveDialogue(Dialogue.CreateGame));
  };

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
      handleGameCreated(event);
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
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('joinGame', action);
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware;
