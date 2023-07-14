import { faChessKnight } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuid } from 'uuid';
import { GridCoordinate, Piece, PieceOwner, PieceType } from '../../types';
import { GridToAxial } from '../Slices/helpers';
import { PieceToIcon } from './maps';

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

PieceToIcon.set(PieceType.knight, faChessKnight);
