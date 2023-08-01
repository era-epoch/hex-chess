import { GameState } from './State/Slices/gameSlice';

export enum PieceType {
  pawn = 'P',
  knight = 'N',
  bishop = 'B',
  rook = 'R',
  queen = 'Q',
  king = 'K',
}

export type GridCoordinate = {
  col: number;
  row: number;
};

export type AxialCoordinate = {
  q: number;
  r: number;
};

export enum PieceOwner {
  black,
  white,
}

export type Piece = {
  id: string;
  tag: string;
  type: PieceType;
  pos: GridCoordinate;
  axial: AxialCoordinate;
  hasMoved: boolean;
  owner: PieceOwner;
};

export enum TileStatusType {
  whiteThreatening = 'whiteThreatening',
  blackThreatening = 'blackThreatening',
  enPassantBlack = 'enPassantBlack',
  enPassantWhite = 'enPassantWhite',
  whitePawnOrigin = 'whitePawnOrigin',
  blackPawnOrigin = 'blackPawnOrigin',
  moveHighlight = 'moveHighlight',
  captureHighlight = 'captureHighlight',
  whitePromoTile = 'whitePromoTile',
  blackPromoTile = 'blackPromoTile',
}

export type TileStatus = {
  type: TileStatusType;
};

export enum MoveType {
  standard = '',
  capture = 'X',
  enPassantCapture = 'x',
  promotion = '^',
}

export type MoveInfo = {
  axial: AxialCoordinate;
  type: MoveType;
  source: Piece;
  promoPiece?: Piece;
};

export type SerializedMove = {
  axial: AxialCoordinate;
  type: MoveType;
  sourceTag: string;
  promoPieceType?: PieceType;
};

export type MoveCalculationFunction = (state: GameState, piece: Piece, verbose?: boolean) => MoveInfo[];

export type MoveStatus = TileStatus & {
  move: MoveInfo;
};

export type Tile = {
  id: string;
  pos: GridCoordinate;
  axial: AxialCoordinate;
  content: Piece | null;
  statuses: TileStatus[];
  playable: boolean;
  boundary: boolean;
};

export enum GameOverState {
  unfinished,
  whiteVictory,
  blackVictory,
  whiteStalemated,
  blackStalemated,
}

export enum ZIndices {
  Dialogues = 100,
  Alerts = 1000,
}

export enum Dialogue {
  none,
  promotion,
  CreateGame,
  JoinGame,
  GameLobby,
  FindGame,
}

export enum PlayerSide {
  white,
  black,
  random,
}

export enum AlertSeverity {
  success = 'green',
  warning = 'orange',
  info = 'blue',
  error = 'red',
}

export type Alert = {
  id: string;
  content: string;
  severity: AlertSeverity;
  alive: boolean;
};

export enum NextTurnSource {
  Reset,
  Local,
  Online,
}

export type LogItem = {
  content: string;
  timestamp: number;
  source: string;
};
