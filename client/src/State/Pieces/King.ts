import { faChessKing } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuid } from 'uuid';
import {
  GridCoordinate,
  MoveCalculationFunction,
  MoveInfo,
  MoveType,
  Piece,
  PieceOwner,
  PieceType,
  TileStatusType,
} from '../../types';
import { GameState } from '../Slices/gameSlice';
import { GetTileAtAxial, GridToAxial } from '../Slices/helpers';
import { CalculateMovesFunctions, PieceToIcon } from './maps';

export interface King extends Piece {}

export const createKing = (pos: GridCoordinate, owner: PieceOwner, tag: string): King => {
  const King: King = {
    id: uuid(),
    tag: tag,
    type: PieceType.king,
    pos: pos,
    axial: GridToAxial(pos),
    hasMoved: false,
    owner: owner,
  };
  return King;
};

export const CalculateKingMoves: MoveCalculationFunction = (state: GameState, king: King): MoveInfo[] => {
  const moves: MoveInfo[] = [];
  const start = king.axial;
  const movements = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [2, -1],
    [1, -2],
    [-1, -1],
    [-2, 1],
    [-1, 2],
  ];
  for (const movement of movements) {
    let targetTile = GetTileAtAxial(state, { q: start.q + movement[0], r: start.r + movement[1] });
    if (targetTile === undefined || !targetTile.playable) {
      continue;
    }

    if (king.owner === PieceOwner.black) {
      if (targetTile.statuses.some((status) => status.type === TileStatusType.whiteThreatening)) {
        continue;
      }
    } else {
      if (targetTile.statuses.some((status) => status.type === TileStatusType.blackThreatening)) {
        continue;
      }
    }

    if (targetTile.content !== null) {
      if (targetTile.content.owner !== king.owner) {
        moves.push({ axial: targetTile.axial, type: MoveType.capture, source: king });
      }
    } else {
      moves.push({ axial: targetTile.axial, type: MoveType.standard, source: king });
    }
  }
  return moves;
};

PieceToIcon.set(PieceType.king, faChessKing);
CalculateMovesFunctions.set(PieceType.king, CalculateKingMoves);
