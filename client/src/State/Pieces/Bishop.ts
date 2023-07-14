import { faChessBishop } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuid } from 'uuid';
import { GridCoordinate, MoveCalculationFunction, MoveInfo, MoveType, Piece, PieceOwner, PieceType } from '../../types';
import { GameState } from '../Slices/gameSlice';
import { GetTileAtAxial, GridToAxial } from '../Slices/helpers';
import { CalculateMovesFunctions, PieceToIcon } from './maps';

export interface Bishop extends Piece {}

export const createBishop = (pos: GridCoordinate, owner: PieceOwner): Bishop => {
  const Bishop: Bishop = {
    id: uuid(),
    type: PieceType.bishop,
    pos: pos,
    axial: GridToAxial(pos),
    hasMoved: false,
    owner: owner,
  };
  return Bishop;
};

export const CalculateBishopMoves: MoveCalculationFunction = (state: GameState, bishop: Bishop): MoveInfo[] => {
  const moves: MoveInfo[] = [];
  const start = bishop.axial;
  const directions = [
    [1, 1],
    [2, -1],
    [1, -2],
    [-1, -1],
    [-2, 1],
    [-1, 2],
  ]; // [r, q] (oops)
  for (const dir of directions) {
    let m = 1;
    let obstructed = false;
    while (!obstructed) {
      let targetTile = GetTileAtAxial(state, { q: start.q + dir[1] * m, r: start.r + dir[0] * m });
      m++;
      if (targetTile === undefined || !targetTile.playable) {
        obstructed = true;
      } else if (targetTile.content !== null) {
        obstructed = true;
        if (targetTile.content.owner !== bishop.owner) {
          moves.push({ axial: targetTile.axial, type: MoveType.capture });
        }
      } else {
        moves.push({ axial: targetTile.axial, type: MoveType.standard });
      }
    }
  }
  return moves;
};

PieceToIcon.set(PieceType.bishop, faChessBishop);
CalculateMovesFunctions.set(PieceType.bishop, CalculateBishopMoves);
