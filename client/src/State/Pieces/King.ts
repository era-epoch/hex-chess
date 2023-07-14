import { faChessKing } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuid } from 'uuid';
import { GridCoordinate, Piece, PieceOwner, PieceType } from '../../types';
import { GridToAxial } from '../Slices/helpers';
import { PieceToIcon } from './maps';

export interface King extends Piece {}

export const createKing = (pos: GridCoordinate, owner: PieceOwner): King => {
  const King: King = {
    id: uuid(),
    type: PieceType.king,
    pos: pos,
    axial: GridToAxial(pos),
    hasMoved: false,
    owner: owner,
  };
  return King;
};

PieceToIcon.set(PieceType.king, faChessKing);
