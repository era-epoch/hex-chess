import { faChessRook } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuid } from 'uuid';
import { GridCoordinate, MoveCalculationFunction, MoveInfo, MoveType, Piece, PieceOwner, PieceType } from '../../types';
import { GameState } from '../Slices/gameSlice';
import { GetTileAtAxial, GridToAxial } from '../Slices/helpers';
import { CalculateMovesFunctions, PieceToIcon } from './maps';

export interface Rook extends Piece {}

export const createRook = (pos: GridCoordinate, owner: PieceOwner, tag: string): Rook => {
  const Rook: Rook = {
    id: uuid(),
    tag: tag,
    type: PieceType.rook,
    pos: pos,
    axial: GridToAxial(pos),
    hasMoved: false,
    owner: owner,
  };
  return Rook;
};

export const CalculateRookMoves: MoveCalculationFunction = (state: GameState, rook: Rook): MoveInfo[] => {
  const moves: MoveInfo[] = [];
  const start = rook.axial;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
  ]; // [q, r]
  for (const dir of directions) {
    let m = 1;
    let obstructed = false;
    while (!obstructed) {
      let targetTile = GetTileAtAxial(state, { q: start.q + dir[0] * m, r: start.r + dir[1] * m });
      m++;
      if (targetTile === undefined || !targetTile.playable) {
        obstructed = true;
      } else if (targetTile.content !== null) {
        obstructed = true;
        if (targetTile.content.owner !== rook.owner) {
          moves.push({ axial: targetTile.axial, type: MoveType.capture, source: rook });
        }
      } else {
        moves.push({ axial: targetTile.axial, type: MoveType.standard, source: rook });
      }
    }
  }
  return moves;
};

PieceToIcon.set(PieceType.rook, faChessRook);
CalculateMovesFunctions.set(PieceType.rook, CalculateRookMoves);
