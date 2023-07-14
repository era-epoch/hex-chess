import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { MoveCalculationFunction, PieceType } from '../../types';

export const PieceToIcon = new Map<PieceType, IconDefinition>();

export const PieceToMoveHighlightFunction = new Map<PieceType, Function>();

export const CalculateMovesFunctions = new Map<PieceType, MoveCalculationFunction>();
