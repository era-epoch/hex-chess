import { faChessRook } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuid } from 'uuid';
import { GridCoordinate, Piece, PieceOwner, PieceType } from '../../types';
import { GridToAxial } from '../Slices/helpers';
import { PieceToIcon } from './maps';

export interface Rook extends Piece {}

export const createRook = (pos: GridCoordinate, owner: PieceOwner): Rook => {
  const Rook: Rook = {
    id: uuid(),
    type: PieceType.rook,
    pos: pos,
    axial: GridToAxial(pos),
    hasMoved: false,
    owner: owner,
  };
  return Rook;
};

PieceToIcon.set(PieceType.rook, faChessRook);
