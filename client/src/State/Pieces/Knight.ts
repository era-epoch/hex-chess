import { faChessKnight } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuid } from 'uuid';
import { GridCoordinate, MoveCalculationFunction, MoveInfo, MoveType, Piece, PieceOwner, PieceType } from '../../types';
import { GameState } from '../Slices/gameSlice';
import { GetTileAtAxial, GridToAxial } from '../Slices/helpers';
import { CalculateMovesFunctions, PieceToIcon } from './maps';

export interface Knight extends Piece {}

export const createKnight = (pos: GridCoordinate, owner: PieceOwner): Knight => {
  const Knight: Knight = {
    id: uuid(),
    type: PieceType.knight,
    pos: pos,
    axial: GridToAxial(pos),
    hasMoved: false,
    owner: owner,
  };
  return Knight;
};

export const CalculateKnightMoves: MoveCalculationFunction = (state: GameState, knight: Knight): MoveInfo[] => {
  const moves: MoveInfo[] = [];
  const start = knight.axial;
  const movements = [
    [2, 1],
    [1, 2],
    [-1, 3],
    [-2, 3],
    [-3, 2],
    [-3, 1],
    [-2, -1],
    [-1, -2],
    [1, -3],
    [2, -3],
    [3, -1],
    [3, -2],
  ];
  for (const movement of movements) {
    let targetTile = GetTileAtAxial(state, { q: start.q + movement[0], r: start.r + movement[1] });
    if (targetTile === undefined || !targetTile.playable) {
      continue;
    } else if (targetTile.content !== null) {
      if (targetTile.content.owner !== knight.owner) {
        moves.push({ axial: targetTile.axial, type: MoveType.capture });
      }
    } else {
      moves.push({ axial: targetTile.axial, type: MoveType.standard });
    }
  }
  return moves;
};

PieceToIcon.set(PieceType.knight, faChessKnight);
CalculateMovesFunctions.set(PieceType.knight, CalculateKnightMoves);
