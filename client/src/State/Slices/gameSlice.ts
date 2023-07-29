import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  AxialCoordinate,
  GameOverState,
  MoveStatus,
  MoveType,
  NextTurnSource,
  Piece,
  PieceOwner,
  PieceType,
  PlayerSide,
  SerializedMove,
  Tile,
  TileStatusType,
} from '../../types';
import { createBishop } from '../Pieces/Bishop';
import { createKnight } from '../Pieces/Knight';
import { createQueen } from '../Pieces/Queen';
import { createRook } from '../Pieces/Rook';
import {
  AxialToGrid,
  CaptureContent,
  CheckForPawnPromotion,
  ClearMoveHighlights,
  GetCurrentPlayer,
  GetPieceByTag,
  GetTileAtAxial,
  HandlePawnDoubleMove,
  NextTurn,
  ResetGameBoard,
  createTile,
} from './helpers';

export interface GameState {
  gameOverState: GameOverState;
  board: Tile[][];
  selected: Tile | null;
  turn: number;
  pawnPromotionFlag: boolean;
  promotionTile: Tile | null;
  promotionCount: number;
  localSide: PlayerSide | null;
  lastMove: SerializedMove | null;
  lastMoveString: string;
  sendMoveFlag: boolean;
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
  pawnPromotionFlag: false,
  promotionTile: null,
  promotionCount: 0,
  localSide: null,
  lastMove: null,
  lastMoveString: '',
  sendMoveFlag: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    resetBoard: (state: GameState) => {
      console.log('Resetting Board');
      state.turn = 0;
      ResetGameBoard(state);
      NextTurn(state, NextTurnSource.Reset);
    },
    setLocalSide: (state: GameState, action: PayloadAction<PlayerSide>) => {
      state.localSide = action.payload;
    },
    highlightMoves: (state: GameState, action: PayloadAction<Piece>) => {
      ClearMoveHighlights(state);
      for (const col of state.board) {
        for (const tile of col) {
          tile.statuses.forEach((status) => {
            if ('move' in status) {
              let s = status as MoveStatus;
              if (s.move.source.id === action.payload.id) {
                if (s.move.type === MoveType.capture || s.move.type === MoveType.enPassantCapture) {
                  tile.statuses.push({ type: TileStatusType.captureHighlight } as MoveStatus);
                } else {
                  tile.statuses.push({ type: TileStatusType.moveHighlight } as MoveStatus);
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
            if ('move' in status) {
              let s = status as MoveStatus;
              return s.move.source.id === action.payload.id;
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

      // Make sure the local player controls the selected piece
      if (mover.owner === PieceOwner.black && state.localSide === PlayerSide.white) return;
      if (mover.owner === PieceOwner.white && state.localSide === PlayerSide.black) return;

      const targetTile = GetTileAtAxial(state, action.payload);
      if (targetTile === undefined) return;
      if (
        targetTile.statuses.some((status) => {
          if ('move' in status) {
            let s = status as MoveStatus;
            return s.move.source.id === mover.id;
          } else {
            return false;
          }
        })
      ) {
        const moveStatus = targetTile.statuses.find((status) => {
          if ('move' in status) {
            let s = status as MoveStatus;
            return s.move.source.id === mover.id;
          } else {
            return false;
          }
        }) as MoveStatus;
        // MOVE!
        CaptureContent(state, targetTile);

        // En-passant capturing
        if (moveStatus.move.type === MoveType.enPassantCapture) {
          if (mover.owner === PieceOwner.black) {
            const epAxial: AxialCoordinate = { q: targetTile.axial.q, r: targetTile.axial.r - 1 };
            const epPos = AxialToGrid(epAxial);
            const enPassantTile = state.board[epPos.col][epPos.row];
            CaptureContent(state, enPassantTile);
          } else {
            const epAxial: AxialCoordinate = { q: targetTile.axial.q, r: targetTile.axial.r + 1 };
            const epPos = AxialToGrid(epAxial);
            const enPassantTile = state.board[epPos.col][epPos.row];
            CaptureContent(state, enPassantTile);
          }
        }

        // Lift-off
        const originAxial: AxialCoordinate = { q: mover.axial.q, r: mover.axial.r };
        state.board[mover.pos.col][mover.pos.row].content = null;

        // Touch-down
        targetTile.content = mover;
        mover.pos = targetTile.pos;
        mover.axial = targetTile.axial;

        // Save the move for serialization
        state.lastMove = {
          axial: moveStatus.move.axial,
          type: moveStatus.move.type,
          sourceTag: moveStatus.move.source.tag,
        };

        HandlePawnDoubleMove(state, mover, targetTile, originAxial);

        if (CheckForPawnPromotion(state, mover, targetTile)) {
          state.pawnPromotionFlag = true;
          state.promotionTile = targetTile;
        } else {
          NextTurn(state, NextTurnSource.Local);
        }
      }
    },
    executePromotePiece: (state: GameState, action: PayloadAction<PieceType>) => {
      const promoPlayer = GetCurrentPlayer(state);
      const promoPos = state.promotionTile!.pos;
      let newPiece: Piece;
      switch (action.payload) {
        case PieceType.bishop:
          newPiece = createBishop(promoPos, promoPlayer, `B*${state.promotionCount + 1}`);
          break;
        case PieceType.knight:
          newPiece = createKnight(promoPos, promoPlayer, `N*${state.promotionCount + 1}`);
          break;
        case PieceType.rook:
          newPiece = createRook(promoPos, promoPlayer, `R*${state.promotionCount + 1}`);
          break;
        default:
          newPiece = createQueen(promoPos, promoPlayer, `Q*${state.promotionCount + 1}`);
          break;
      }

      state.board[promoPos.col][promoPos.row].content = newPiece;

      state.pawnPromotionFlag = false;
      state.promotionTile = null;
      state.promotionCount++;

      state.lastMove!.promoPieceType = action.payload;
      state.lastMove!.type = MoveType.promotion;

      // And now we end the turn
      NextTurn(state, NextTurnSource.Local);
    },
    setSendMoveFlag: (state: GameState, action: PayloadAction<boolean>) => {
      state.sendMoveFlag = action.payload;
    },
    recieveOnlineMove: (state: GameState, action: PayloadAction<SerializedMove>) => {
      let opponent = state.localSide === PlayerSide.black ? PieceOwner.white : PieceOwner.black;
      const targetTile = GetTileAtAxial(state, action.payload.axial);
      if (targetTile === undefined) {
        console.error('Target tile not found');
        return;
      }
      const mover = GetPieceByTag(state, opponent, action.payload.sourceTag);
      if (mover === null) {
        console.error('Piece not found');
        return;
      }

      // MOVE! (TODO: use one helper function for both local and online moves)
      CaptureContent(state, targetTile);

      // En-passant capturing
      if (action.payload.type === MoveType.enPassantCapture) {
        if (mover.owner === PieceOwner.black) {
          const epAxial: AxialCoordinate = { q: targetTile.axial.q, r: targetTile.axial.r - 1 };
          const epPos = AxialToGrid(epAxial);
          const enPassantTile = state.board[epPos.col][epPos.row];
          CaptureContent(state, enPassantTile);
        } else {
          const epAxial: AxialCoordinate = { q: targetTile.axial.q, r: targetTile.axial.r + 1 };
          const epPos = AxialToGrid(epAxial);
          const enPassantTile = state.board[epPos.col][epPos.row];
          CaptureContent(state, enPassantTile);
        }
      }

      // Lift-off
      const originAxial: AxialCoordinate = { q: mover.axial.q, r: mover.axial.r };
      state.board[mover.pos.col][mover.pos.row].content = null;

      // Touch-down
      targetTile.content = mover;
      mover.pos = targetTile.pos;
      mover.axial = targetTile.axial;

      HandlePawnDoubleMove(state, mover, targetTile, originAxial);

      // Save the move for serialization
      state.lastMove = {
        axial: action.payload.axial,
        type: action.payload.type,
        sourceTag: action.payload.sourceTag,
      };

      // Handle promotion
      if (action.payload.type === MoveType.promotion) {
        let newPiece: Piece;
        switch (action.payload.promoPieceType) {
          case PieceType.bishop:
            newPiece = createBishop(targetTile.pos, opponent, `B*${state.promotionCount + 1}`);
            break;
          case PieceType.knight:
            newPiece = createKnight(targetTile.pos, opponent, `N*${state.promotionCount + 1}`);
            break;
          case PieceType.rook:
            newPiece = createRook(targetTile.pos, opponent, `R*${state.promotionCount + 1}`);
            break;
          default:
            newPiece = createQueen(targetTile.pos, opponent, `Q*${state.promotionCount + 1}`);
            break;
        }
        state.promotionCount++;
        state.board[targetTile.pos.col][targetTile.pos.row].content = newPiece;
        state.lastMove!.promoPieceType = action.payload.promoPieceType;
        state.lastMove!.type = MoveType.promotion;
      }

      // And now we end the turn
      NextTurn(state, NextTurnSource.Online);
    },
  },
});

export default gameSlice.reducer;
export const {
  resetBoard,
  highlightMoves,
  unhighlightMoves,
  selectTile,
  unhighlightAllMoves,
  attemptMove,
  executePromotePiece,
  setLocalSide,
  setSendMoveFlag,
  recieveOnlineMove,
} = gameSlice.actions;
