import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { Socket, io } from 'socket.io-client';
import {
  ConnectedEvent,
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
} from '../../websockets/events';
import {
  pushAlert,
  pushLogItem,
  setActiveDialogue,
  setOnlineGameId,
  setOnlinePlayerId,
  setOpponentName,
  setPlayerSide,
  setServicePopulation,
} from './State/Slices/appSlice';
import { recieveOnlineMove, resetBoard, setLocalSide } from './State/Slices/gameSlice';
import { RootState } from './State/rootReducer';
import { IS_PROD } from './env';
import { AlertSeverity, Dialogue, LogItem, PlayerSide, SerializedMove } from './types';
import { createAlert } from './utility';

export const wsConnect = () => ({ type: 'WS_CONNECT' });
export const wsDisconnect = () => ({ type: 'WS_DISCONNECT' });
export const wsCreateGame = () => ({ type: 'WS_CREATE_GAME' });
export const wsFindGame = () => ({ type: 'WS_FIND_GAME' });
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
export const wsSendChat = (roomId: string, item: LogItem) => ({ type: 'WS_SEND_CHAT', roomId, item });
export const wsJoinRoomDirect = (roomId: string) => ({ type: 'WS_JOIN_ROOM', roomId });

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

    socket.on('connected', (event: ConnectedEvent) => {
      api.dispatch(setServicePopulation(event.population));
      api.dispatch(
        pushLogItem({
          content: `Current Hex-Chess.io population: ${event.population}`,
          source: 'Game',
          timestamp: Date.now(),
        }),
      );
    });

    /* Socket events */
    socket.on('gameCreated', (event: GameCreatedEvent) => {
      api.dispatch(setOnlineGameId(event.roomId));
      api.dispatch(setOnlinePlayerId(event.playerId));
      api.dispatch(setActiveDialogue(Dialogue.CreateGame));
      api.dispatch(
        pushLogItem({
          content: `New online game created with id: ${event.roomId}`,
          source: 'Game',
          timestamp: Date.now(),
        }),
      );
    });

    socket.on('joinGameFailed', (event: JoinGameFailedEvent) => {
      api.dispatch(pushAlert(createAlert(`Join failed: ${event.reason}`, AlertSeverity.error)));
    });

    socket.on('gameJoined', (event: GameJoinedEvent) => {
      api.dispatch(setOnlineGameId(event.roomId));
      api.dispatch(setOnlinePlayerId(event.playerId));
      api.dispatch(pushAlert(createAlert('Joined game!', AlertSeverity.success)));
      api.dispatch(setActiveDialogue(Dialogue.GameLobby));
      api.dispatch(
        pushLogItem({
          content: `Joined online game: ${event.roomId}`,
          source: 'Game',
          timestamp: Date.now(),
        }),
      );
    });

    socket.on('newPlayerJoined', (event: NewPlayerJoinedEvent) => {
      api.dispatch(pushAlert(createAlert(`${event.playerName} has joined your game`, AlertSeverity.success)));
      api.dispatch(setOpponentName(event.playerName));
      // Push the current state of things to the newly-joined player
      const state: RootState = api.getState();
      api.dispatch(wsUpdateName(state.app.playerName, state.app.onlinePlayerId!, state.app.onlineGameId!));
      api.dispatch(wsUpdateSide(state.app.playerSide, state.app.onlinePlayerId!, state.app.onlineGameId!));
      api.dispatch(
        pushLogItem({
          content: `New player joined: ${event.playerName}`,
          source: 'Game',
          timestamp: Date.now(),
        }),
      );
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
      api.dispatch(
        pushLogItem({
          content: `Game started`,
          source: 'Game',
          timestamp: Date.now(),
        }),
      );
    });

    socket.on('receiveMove', (event: ReceiveMoveEvent) => {
      api.dispatch(recieveOnlineMove(event.move));
    });

    socket.on('receiveChat', (event: ReceiveChatEvent) => {
      api.dispatch(pushLogItem(event.item));
    });

    socket.on('joinedQueue', () => {
      api.dispatch(
        pushLogItem({
          content: `Joined matchmaking queue.`,
          source: 'Game',
          timestamp: Date.now(),
        }),
      );
    });

    socket.on('matchmadeGameJoined', (event: MatchmadeGameJoinedEvent) => {
      api.dispatch(
        pushLogItem({
          content: `Game found!`,
          source: 'Game',
          timestamp: Date.now(),
        }),
      );
      api.dispatch(setOnlineGameId(event.gameId));
      api.dispatch(setOnlinePlayerId(event.playerId));
      api.dispatch(setActiveDialogue(Dialogue.none));
      api.dispatch(pushAlert(createAlert('Game Started', AlertSeverity.success)));
      api.dispatch(resetBoard());
      api.dispatch(setLocalSide(event.playerSide));
      api.dispatch(wsJoinRoomDirect(event.gameId));
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
      case 'WS_FIND_GAME':
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('findGame');
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
        console.log(action);
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('sendMove', action as SendMoveEvent);
        break;
      case 'WS_SEND_CHAT':
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('sendChat', action as SendChatEvent);
        break;
      case 'WS_JOIN_ROOM':
        if (socket === null) connect(action);
        if (socket !== null) socket.emit('joinRoomDirect', action as JoinRoomDirectEvent);
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware;
