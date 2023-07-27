export interface ConnectEvent {
  url: string;
}

export interface JoinGameEvent {
  roomId: string;
}

export interface CreateGameEvent {}

export interface GameJoinedEvent {}

export interface GameCreatedEvent {
  roomId: string;
  playerId: string;
}
