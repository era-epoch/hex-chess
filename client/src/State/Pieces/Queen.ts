import { faChessQueen } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuid } from 'uuid';
import { GridCoordinate, MoveCalculationFunction, MoveInfo, MoveType, Piece, PieceOwner, PieceType } from '../../types';
import { GameState } from '../Slices/gameSlice';
import { GetTileAtAxial, GridToAxial } from '../Slices/helpers';
import { CalculateMovesFunctions, PieceToIcon } from './maps';

export interface Queen extends Piece {}

export const createQueen = (pos: GridCoordinate, owner: PieceOwner): Queen => {
  const Queen: Queen = {
    id: uuid(),
    type: PieceType.queen,
    pos: pos,
    axial: GridToAxial(pos),
    hasMoved: false,
    owner: owner,
  };
  return Queen;
};

export const CalculateQueenMoves: MoveCalculationFunction = (state: GameState, queen: Queen): MoveInfo[] => {
  const moves: MoveInfo[] = [];
  const start = queen.axial;

  // Rook movement
  let directions = [
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
        if (targetTile.content.owner !== queen.owner) {
          moves.push({ axial: targetTile.axial, type: MoveType.capture });
        }
      } else {
        moves.push({ axial: targetTile.axial, type: MoveType.standard });
      }
    }
  }

  // Bishop movement
  directions = [
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
        if (targetTile.content.owner !== queen.owner) {
          moves.push({ axial: targetTile.axial, type: MoveType.capture });
        }
      } else {
        moves.push({ axial: targetTile.axial, type: MoveType.standard });
      }
    }
  }

  return moves;
};

PieceToIcon.set(PieceType.queen, faChessQueen);
CalculateMovesFunctions.set(PieceType.queen, CalculateQueenMoves);
