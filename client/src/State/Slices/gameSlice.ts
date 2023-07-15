import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AxialCoordinate, MoveStatus, MoveType, Piece, Tile, TileStatusType } from '../../types';
import { CalculateMovesFunctions } from '../Pieces/maps';
import { AdvanceTurn, AnalyzeThreats, GetTileAtAxial, ResetGameBoard, createTile } from './helpers';

export interface GameState {
  board: Tile[][];
  selected: AxialCoordinate | null;
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
  board: emptyBoard,
  selected: null,
  turn: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    resetBoard: (state: GameState) => {
      state.turn = 0;
      ResetGameBoard(state);
      AdvanceTurn(state);
      AnalyzeThreats(state);
    },
    highlightMoves: (state: GameState, action: PayloadAction<Piece>) => {
      const moveF = CalculateMovesFunctions.get(action.payload.type);
      if (moveF !== undefined) {
        const moves = moveF(state, action.payload);
        for (const move of moves) {
          const target = GetTileAtAxial(state, move.axial);
          if (move.type === MoveType.capture) {
            target?.statuses.push({ type: TileStatusType.captureHighlight, origin: action.payload } as MoveStatus);
          } else {
            target?.statuses.push({ type: TileStatusType.moveHighlight, origin: action.payload } as MoveStatus);
          }
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
    selectTile: (state: GameState, action: PayloadAction<AxialCoordinate | null>) => {
      state.selected = action.payload;
    },
  },
});

export default gameSlice.reducer;
export const { resetBoard, highlightMoves, unhighlightMoves, selectTile } = gameSlice.actions;
