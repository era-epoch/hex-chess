import { faChessQueen } from '@fortawesome/free-regular-svg-icons';
import { v4 as uuid } from 'uuid';
import { GridCoordinate, Piece, PieceOwner, PieceType } from '../../types';
import { GridToAxial } from '../Slices/helpers';
import { PieceToIcon } from './maps';

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

PieceToIcon.set(PieceType.queen, faChessQueen);
