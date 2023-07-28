import { faChessPawn } from '@fortawesome/free-regular-svg-icons';
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

export interface Pawn extends Piece {}

export const createPawn = (pos: GridCoordinate, owner: PieceOwner, tag: string): Pawn => {
  const pawn: Pawn = {
    id: uuid(),
    tag: tag,
    type: PieceType.pawn,
    pos: pos,
    axial: GridToAxial(pos),
    hasMoved: false,
    owner: owner,
  };
  return pawn;
};

export const CalculatePawnMoves: MoveCalculationFunction = (state: GameState, pawn: Pawn): MoveInfo[] => {
  const moves: MoveInfo[] = [];
  const start = pawn.axial;
  let startTile = GetTileAtAxial(state, { q: start.q, r: start.r });

  let targetTile;
  if (pawn.owner === PieceOwner.white) {
    targetTile = GetTileAtAxial(state, { q: start.q, r: start.r - 1 });
  } else {
    targetTile = GetTileAtAxial(state, { q: start.q, r: start.r + 1 });
  }

  if (targetTile !== undefined && targetTile.playable && targetTile.content === null) {
    moves.push({ axial: targetTile.axial, type: MoveType.standard, source: pawn });
    let secondTarget;
    if (
      pawn.owner === PieceOwner.white &&
      startTile?.statuses.some((status) => status.type === TileStatusType.whitePawnOrigin)
    ) {
      secondTarget = GetTileAtAxial(state, { q: start.q, r: start.r - 2 });
    } else if (
      pawn.owner === PieceOwner.black &&
      startTile?.statuses.some((status) => status.type === TileStatusType.blackPawnOrigin)
    ) {
      secondTarget = GetTileAtAxial(state, { q: start.q, r: start.r + 2 });
    }
    if (secondTarget !== undefined && secondTarget.playable && secondTarget.content === null) {
      moves.push({ axial: secondTarget.axial, type: MoveType.standard, source: pawn });
    }
  }

  // Check for captures
  let captures = []; // [q, r]
  let targetEP: TileStatusType | null = null;
  if (pawn.owner === PieceOwner.white) {
    captures.push([-1, 0]);
    captures.push([1, -1]);
    targetEP = TileStatusType.enPassantBlack;
  } else {
    captures.push([1, 0]);
    captures.push([-1, 1]);
    targetEP = TileStatusType.enPassantWhite;
  }
  for (const capture of captures) {
    let captureTile = GetTileAtAxial(state, { q: start.q + capture[0], r: start.r + capture[1] });
    if (captureTile !== undefined && captureTile.content !== null && captureTile.content.owner !== pawn.owner) {
      moves.push({ axial: captureTile.axial, type: MoveType.capture, source: pawn });
    }
    if (captureTile !== undefined && captureTile.statuses.some((status) => status.type === targetEP)) {
      moves.push({ axial: captureTile.axial, type: MoveType.enPassantCapture, source: pawn });
    }
  }
  return moves;
};

PieceToIcon.set(PieceType.pawn, faChessPawn);
CalculateMovesFunctions.set(PieceType.pawn, CalculatePawnMoves);
