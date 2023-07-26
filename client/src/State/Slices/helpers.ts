import produce from 'immer';
import { v4 as uuid } from 'uuid';
import {
  AxialCoordinate,
  GameOverState,
  GridCoordinate,
  MoveStatus,
  Piece,
  PieceOwner,
  PieceType,
  Tile,
  TileStatus,
  TileStatusType,
} from '../../types';
import { createBishop } from '../Pieces/Bishop';
import { createKing } from '../Pieces/King';
import { createKnight } from '../Pieces/Knight';
import { createPawn } from '../Pieces/Pawn';
import { createQueen } from '../Pieces/Queen';
import { createRook } from '../Pieces/Rook';
import { CalculateMovesFunctions } from '../Pieces/maps';
import { GameState } from './gameSlice';

export const IsGridPositionPlayable = (pos: GridCoordinate): boolean => {
  switch (pos.col) {
    case 0:
      if (pos.row < 3) return false;
      if (pos.row > 8) return false;
      break;
    case 1:
      if (pos.row < 2) return false;
      if (pos.row > 8) return false;
      break;
    case 2:
      if (pos.row < 2) return false;
      if (pos.row > 9) return false;
      break;
    case 3:
      if (pos.row < 1) return false;
      if (pos.row > 9) return false;
      break;
    case 4:
      if (pos.row < 1) return false;
      if (pos.row > 10) return false;
      break;
    case 6:
      if (pos.row < 1) return false;
      if (pos.row > 10) return false;
      break;
    case 7:
      if (pos.row < 1) return false;
      if (pos.row > 9) return false;
      break;
    case 8:
      if (pos.row < 2) return false;
      if (pos.row > 9) return false;
      break;
    case 9:
      if (pos.row < 2) return false;
      if (pos.row > 8) return false;
      break;
    case 10:
      if (pos.row < 3) return false;
      if (pos.row > 8) return false;
      break;
  }
  return true;
};

export const GridToAxial = (g: GridCoordinate): AxialCoordinate => {
  const raw_grid_col = g.col - 5;
  const raw_grid_row = g.row - 5;
  return {
    q: raw_grid_col,
    r: raw_grid_row - (raw_grid_col + (raw_grid_col & 1)) / 2,
  };
};

export const AxialToGrid = (a: AxialCoordinate): GridCoordinate => {
  const raw_grid_col = a.q;
  const raw_grid_row = a.r + (a.q + (a.q & 1)) / 2;
  return {
    col: raw_grid_col + 5,
    row: raw_grid_row + 5,
  };
};

// TODO: improve this
export const GetTileAtAxial = (gameState: GameState, axial: AxialCoordinate): Tile | undefined => {
  const grid = AxialToGrid(axial);
  if (gameState.board[grid.col] !== undefined) {
    return gameState.board[grid.col][grid.row];
  }
};

export const createTile = (pos: GridCoordinate): Tile => {
  const tile: Tile = {
    id: uuid(),
    pos: pos,
    axial: GridToAxial(pos),
    content: null,
    statuses: [],
    playable: IsGridPositionPlayable(pos),
    boundary: false,
  };
  return tile;
};

export const ResetGameBoard = (gameState: GameState) => {
  const newBoard: Tile[][] = [];

  for (let i = 0; i < 11; i++) {
    newBoard.push([]);
    for (let j = 0; j < 11; j++) {
      newBoard[i].push(createTile({ col: i, row: j }));
    }
  }

  // Mark promotion tiles

  const whitePromoTiles = [
    { col: 0, row: 3 },
    { col: 1, row: 2 },
    { col: 2, row: 2 },
    { col: 3, row: 1 },
    { col: 4, row: 1 },
    { col: 5, row: 0 },
    { col: 6, row: 1 },
    { col: 7, row: 1 },
    { col: 8, row: 2 },
    { col: 9, row: 2 },
    { col: 10, row: 3 },
  ];
  for (const tile of whitePromoTiles) {
    newBoard[tile.col][tile.row].statuses.push({ type: TileStatusType.whitePromoTile });
  }
  const blackPromoTiles = [
    { col: 0, row: 8 },
    { col: 1, row: 8 },
    { col: 2, row: 9 },
    { col: 3, row: 9 },
    { col: 4, row: 10 },
    { col: 5, row: 10 },
    { col: 6, row: 10 },
    { col: 7, row: 9 },
    { col: 8, row: 9 },
    { col: 9, row: 8 },
    { col: 10, row: 8 },
  ];
  for (const tile of blackPromoTiles) {
    newBoard[tile.col][tile.row].statuses.push({ type: TileStatusType.blackPromoTile });
  }

  // White Piece setup

  const whitePawnsStartingCoordinates: GridCoordinate[] = [
    { col: 1, row: 8 },
    { col: 2, row: 8 },
    { col: 3, row: 7 },
    { col: 4, row: 7 },
    { col: 5, row: 6 },
    { col: 6, row: 7 },
    { col: 7, row: 7 },
    { col: 8, row: 8 },
    { col: 9, row: 8 },
  ];

  for (const g of whitePawnsStartingCoordinates) {
    newBoard[g.col][g.row].content = createPawn(g, PieceOwner.white);
    newBoard[g.col][g.row].statuses.push({ type: TileStatusType.whitePawnOrigin });
  }

  newBoard[5][8].content = createBishop({ col: 5, row: 8 }, PieceOwner.white);
  newBoard[5][9].content = createBishop({ col: 5, row: 9 }, PieceOwner.white);
  newBoard[5][10].content = createBishop({ col: 5, row: 10 }, PieceOwner.white);

  newBoard[2][9].content = createRook({ col: 2, row: 9 }, PieceOwner.white);
  newBoard[8][9].content = createRook({ col: 8, row: 9 }, PieceOwner.white);

  newBoard[3][9].content = createKnight({ col: 3, row: 9 }, PieceOwner.white);
  newBoard[7][9].content = createKnight({ col: 7, row: 9 }, PieceOwner.white);

  newBoard[4][10].content = createQueen({ col: 4, row: 10 }, PieceOwner.white);
  newBoard[6][10].content = createKing({ col: 6, row: 10 }, PieceOwner.white);

  // Black piece setup

  const blackPawnsStartingCoordinates: GridCoordinate[] = [
    { col: 1, row: 2 },
    { col: 2, row: 3 },
    { col: 3, row: 3 },
    { col: 4, row: 4 },
    { col: 5, row: 4 },
    { col: 6, row: 4 },
    { col: 7, row: 3 },
    { col: 8, row: 3 },
    { col: 9, row: 2 },
  ];

  for (const g of blackPawnsStartingCoordinates) {
    newBoard[g.col][g.row].content = createPawn(g, PieceOwner.black);
    newBoard[g.col][g.row].statuses.push({ type: TileStatusType.blackPawnOrigin });
  }

  newBoard[5][0].content = createBishop({ col: 5, row: 0 }, PieceOwner.black);
  newBoard[5][1].content = createBishop({ col: 5, row: 1 }, PieceOwner.black);
  newBoard[5][2].content = createBishop({ col: 5, row: 2 }, PieceOwner.black);

  newBoard[2][2].content = createRook({ col: 2, row: 2 }, PieceOwner.black);
  newBoard[8][2].content = createRook({ col: 8, row: 2 }, PieceOwner.black);

  newBoard[3][1].content = createKnight({ col: 3, row: 1 }, PieceOwner.black);
  newBoard[7][1].content = createKnight({ col: 7, row: 1 }, PieceOwner.black);

  newBoard[4][1].content = createQueen({ col: 4, row: 1 }, PieceOwner.black);
  newBoard[6][1].content = createKing({ col: 6, row: 1 }, PieceOwner.black);

  gameState.board = newBoard;
};

export const AnalyzeThreats = (state: GameState) => {
  for (const col of state.board) {
    for (const tile of col) {
      if (tile.content !== null) {
        PopulateThreats(state, tile.content, true);
      }
    }
  }
};

export const PopulateThreats = (state: GameState, piece: Piece, checkKing: boolean) => {
  const moveF = CalculateMovesFunctions.get(piece.type);
  if (moveF === undefined) return;
  const moves = moveF(state, piece);
  for (const move of moves) {
    // Check if king is under threat and prune moves
    // TODO: improve efficiency of this
    let validMove = true;
    if (checkKing) {
      const image = produce(state, (draftState: GameState) => {
        const premonitionBoard = draftState.board;
        const premonitionMover = premonitionBoard[piece.pos.col][piece.pos.row].content as Piece;
        const gridMove = AxialToGrid(move.axial);
        premonitionMover.pos = gridMove;
        premonitionMover.axial = move.axial;
        premonitionBoard[gridMove.col][gridMove.row].content = premonitionMover;

        premonitionBoard[piece.pos.col][piece.pos.row].content = null;

        for (const col of premonitionBoard) {
          for (const tile of col) {
            if (tile.content !== null) {
              PopulateThreats(draftState, tile.content, false);
            }
          }
        }

        const kingTile = GetTileWithKing(draftState, piece.owner);
        if (kingTile !== undefined && piece.owner === PieceOwner.black) {
          if (kingTile.statuses.some((status) => status.type === TileStatusType.whiteThreatening)) {
            validMove = false;
          }
        } else if (kingTile !== undefined && piece.owner === PieceOwner.white) {
          if (kingTile.statuses.some((status) => status.type === TileStatusType.blackThreatening)) {
            validMove = false;
          }
        }
      });
    }

    if (!validMove) continue;

    const tile = GetTileAtAxial(state, move.axial);
    if (piece.owner === PieceOwner.black) {
      tile?.statuses.push({ type: TileStatusType.blackThreatening, origin: piece } as MoveStatus);
    } else {
      tile?.statuses.push({ type: TileStatusType.whiteThreatening, origin: piece } as MoveStatus);
    }
  }
};

export const EndTurn = (state: GameState) => {
  ClearThreatStatuses(state);
  ClearMoveHighlights(state);
  state.selected = null;
};

export const ClearThreatStatuses = (state: GameState) => {
  for (const col of state.board) {
    for (const tile of col) {
      state.board[tile.pos.col][tile.pos.row].statuses = tile.statuses.filter((status) => {
        return status.type !== TileStatusType.whiteThreatening && status.type !== TileStatusType.blackThreatening;
      });
    }
  }
};

export const ClearMoveHighlights = (state: GameState) => {
  for (const col of state.board) {
    for (const tile of col) {
      state.board[tile.pos.col][tile.pos.row].statuses = tile.statuses.filter((status) => {
        return status.type !== TileStatusType.moveHighlight && status.type !== TileStatusType.captureHighlight;
      });
    }
  }
};

export const CaptureContent = (state: GameState, tile: Tile) => {
  state.board[tile.pos.col][tile.pos.row].content = null;
};

export const StartTurn = (state: GameState) => {
  state.turn += 1;
  AnalyzeThreats(state);
  CheckForGameOver(state);
};

export const CheckForGameOver = (state: GameState): { gameOver: boolean; result: GameOverState } => {
  let whiteHasMove = false;
  let blackHasMove = false;
  for (const col of state.board) {
    for (const tile of col) {
      if (tile.statuses.some((status) => status.type === TileStatusType.blackThreatening)) {
        blackHasMove = true;
      }
      if (tile.statuses.some((status) => status.type === TileStatusType.whiteThreatening)) {
        whiteHasMove = true;
      }
      if ((state.turn % 2 === 0 && blackHasMove) || (state.turn % 2 === 1 && whiteHasMove)) {
        return { gameOver: false, result: GameOverState.unfinished };
      }
    }
  }
  // Current player loses
  if (state.turn % 2 === 0) {
    const kingTile = GetTileWithKing(state, PieceOwner.black);
    if (kingTile?.statuses.some((status) => status.type === TileStatusType.whiteThreatening)) {
      return { gameOver: true, result: GameOverState.blackStalemated };
    } else {
      return { gameOver: true, result: GameOverState.whiteVictory };
    }
  } else {
    const kingTile = GetTileWithKing(state, PieceOwner.white);
    if (kingTile?.statuses.some((status) => status.type === TileStatusType.blackThreatening)) {
      return { gameOver: true, result: GameOverState.whiteStalemated };
    } else {
      return { gameOver: true, result: GameOverState.blackVictory };
    }
  }
};

export const GetTileWithKing = (state: GameState, player: PieceOwner): Tile | undefined => {
  for (const col of state.board) {
    for (const tile of col) {
      if (tile.content !== null && tile.content.owner === player && tile.content.type === PieceType.king) {
        return tile;
      }
    }
  }
};

export const CheckForPawnPromotion = (state: GameState, mover: Piece, targetTile: Tile): boolean => {
  if (mover.type !== PieceType.pawn) return false;
  if (mover.owner === PieceOwner.black) {
    return targetTile.statuses.some((status: TileStatus) => status.type === TileStatusType.blackPromoTile);
  } else {
    return targetTile.statuses.some((status: TileStatus) => status.type === TileStatusType.whitePromoTile);
  }
};

export const GetCurrentPlayer = (state: GameState): PieceOwner => {
  return state.turn % 2 === 0 ? PieceOwner.black : PieceOwner.white;
};
