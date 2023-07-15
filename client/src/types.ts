import { GameState } from './State/Slices/gameSlice';

export enum PieceType {
  pawn,
  knight,
  bishop,
  rook,
  queen,
  king,
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
  type: PieceType;
  pos: GridCoordinate;
  axial: AxialCoordinate;
  hasMoved: boolean;
  owner: PieceOwner;
};

export enum TileStatusType {
  whiteThreatening,
  blackThreatening,
  enPassant,
  whitePawnOrigin,
  blackPawnOrigin,
  moveHighlight,
  captureHighlight,
}

export type TileStatus = {
  type: TileStatusType;
};

export enum MoveType {
  standard,
  capture,
}

export type MoveInfo = {
  axial: AxialCoordinate;
  type: MoveType;
};

export type MoveCalculationFunction = (state: GameState, piece: Piece) => MoveInfo[];

export type MoveStatus = TileStatus & {
  origin: Piece;
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
