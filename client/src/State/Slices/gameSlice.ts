import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AxialCoordinate, GameOverState, MoveStatus, Piece, PieceOwner, Tile, TileStatusType } from '../../types';
import {
  CaptureContent,
  ClearMoveHighlights,
  EndTurn,
  GetTileAtAxial,
  ResetGameBoard,
  StartTurn,
  createTile,
} from './helpers';

export interface GameState {
  gameOverState: GameOverState;
  board: Tile[][];
  selected: Tile | null;
  turn: number;
}

export const emptyBoard: Tile[][] = [];

for (let i = 0; i < 11; i++) {
  emptyBoard.push([]);
  for (let j = 0; j < 11; j++) {
    emptyBoard[i].push(createTile({ col: i, row: j }));
  }
}

const initialGameState: GameState = {
  gameOverState: GameOverState.unfinished,
  board: emptyBoard,
  selected: null,
  turn: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    resetBoard: (state: GameState) => {
      console.log('Resetting Board');
      state.turn = 0;
      ResetGameBoard(state);
      EndTurn(state);
      StartTurn(state);
    },
    highlightMoves: (state: GameState, action: PayloadAction<Piece>) => {
      ClearMoveHighlights(state);
      for (const col of state.board) {
        for (const tile of col) {
          tile.statuses.forEach((status) => {
            if ('origin' in status) {
              let s = status as MoveStatus;
              if (s.origin.id === action.payload.id) {
                if (tile.content === null) {
                  tile.statuses.push({ type: TileStatusType.moveHighlight, origin: action.payload } as MoveStatus);
                } else {
                  tile.statuses.push({ type: TileStatusType.captureHighlight, origin: action.payload } as MoveStatus);
                }
              }
            }
          });
        }
      }
    },
    unhighlightMoves: (state: GameState, action: PayloadAction<Piece>) => {
      for (const col of state.board) {
        for (const tile of col) {
          tile.statuses = tile.statuses.filter((status) => {
            if ('origin' in status) {
              let s = status as MoveStatus;
              return s.origin.id !== action.payload.id;
            } else {
              return true;
            }
          });
        }
      }
    },
    unhighlightAllMoves: (state: GameState) => {
      ClearMoveHighlights(state);
    },
    selectTile: (state: GameState, action: PayloadAction<Tile | null>) => {
      state.selected = action.payload;
    },
    attemptMove: (state: GameState, action: PayloadAction<AxialCoordinate>) => {
      if (state.selected === null) return;
      if (state.selected.content === null) return;
      const mover = state.selected.content;

      // Make sure it is the turn of the selected piece
      if (mover.owner === PieceOwner.black && state.turn % 2 === 1) return;
      if (mover.owner === PieceOwner.white && state.turn % 2 === 0) return;

      const targetTile = GetTileAtAxial(state, action.payload);
      if (targetTile === undefined) return;
      if (
        targetTile.statuses.some((status) => {
          if ('origin' in status) {
            let s = status as MoveStatus;
            return s.origin.id === mover.id;
          } else {
            return false;
          }
        })
      ) {
        // MOVE!
        CaptureContent(targetTile);
        // Lift-off
        state.board[mover.pos.col][mover.pos.row].content = null;
        // Touch-down
        targetTile.content = mover;
        mover.pos = targetTile.pos;
        mover.axial = targetTile.axial;

        EndTurn(state);
        StartTurn(state);
      }
    },
  },
});

export default gameSlice.reducer;
export const { resetBoard, highlightMoves, unhighlightMoves, selectTile, unhighlightAllMoves, attemptMove } =
  gameSlice.actions;
