export interface ConnectEvent {
  url: string;
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
