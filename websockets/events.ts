import { LogItem, PlayerSide, SerializedMove } from '../client/src/types';

export interface ConnectEvent {
  url: string;
}

export interface ConnectedEvent {
  population: number;
}

export interface JoinGameEvent {
  roomId: string;
  playerName: string;
}

export interface JoinGameFailedEvent {
  reason: string;
}

export interface CreateGameEvent {}

export interface GameJoinedEvent {
  roomId: string;
  playerId: string;
}

export interface GameCreatedEvent {
  roomId: string;
  playerId: string;
}

export interface NewPlayerJoinedEvent {
  playerId: string;
  playerName: string;
}

export interface UpdatePlayerNameEvent {
  roomId: string;
  playerId: string;
  playerName: string;
}

export interface PlayerNameUpdatedEvent {
  playerId: string;
  playerName: string;
}

export interface UpdatePlayerSideEvent {
  roomId: string;
  playerId: string;
  playerSide: PlayerSide;
}

export interface PlayerSideUpdatedEvent {
  playerId: string;
  playerSide: PlayerSide;
}

export interface StartGameEvent {
  roomId: string;
  creatorId: string;
  creatorSide: PlayerSide;
}

export interface GameStartedEvent {
  creatorId: string;
  creatorSide: PlayerSide;
}

export interface SendMoveEvent {
  roomId: string;
  move: SerializedMove;
}

export interface ReceiveMoveEvent {
  move: SerializedMove;
}

export interface SendChatEvent {
  roomId: string;
  item: LogItem;
}

export interface ReceiveChatEvent {
  item: LogItem;
}

export interface FindGameEvent {
  playerName: string;
}

export interface CancelFindGameEvent {}

export interface MatchmadeGameJoinedEvent {
  gameId: string;
  playerId: string;
  playerSide: PlayerSide;
}

export interface JoinRoomDirectEvent {
  roomId: string;
}
