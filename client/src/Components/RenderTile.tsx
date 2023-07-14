import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CSS from 'csstype';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PieceToIcon } from '../State/Pieces/maps';
import { highlightMoves, selectTile, unhighlightMoves } from '../State/Slices/gameSlice';
import { AxialToGrid, GridToAxial } from '../State/Slices/helpers';
import { RootState } from '../State/rootReducer';
import { PieceOwner, Tile, TileStatusType } from '../types';

interface Props {
  tileStyle: CSS.Properties;
  tile: Tile;
}

const RenderTile = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const selectedTile = useSelector((state: RootState) => state.game.selected);
  const tileStyle = { ...props.tileStyle } as any;
  const piece = props.tile.content;
  const axial = GridToAxial(props.tile.pos);
  const grid = AxialToGrid(axial);

  let selected = false;
  if (selectedTile !== null) {
    selected = selectedTile.q === props.tile.axial.q && selectedTile.r === props.tile.axial.r;
  }

  const [highlightActive, setHighlightActive] = useState(false);

  const wrapperStyle = {
    '--piece-color': 'white',
    '--piece-contrast': 'black',
  };

  if (piece !== null) {
    if (piece.owner === PieceOwner.black) {
      if (selected) {
        wrapperStyle['--piece-color'] = '#8B8000';
      } else {
        wrapperStyle['--piece-color'] = 'black';
      }
      wrapperStyle['--piece-contrast'] = 'white';
    } else {
      if (selected) {
        wrapperStyle['--piece-color'] = '#F0E68C';
      }
    }
  }

  let tileFlag;

  if (props.tile.pos.col % 2 === 0) {
    tileFlag = props.tile.pos.row % 3;
  } else {
    tileFlag = (props.tile.pos.row + 2) % 3;
  }

  switch (tileFlag) {
    case 0:
      tileStyle['--hex-colour'] = 'var(--background)';
      break;
    case 1:
      tileStyle['--hex-colour'] = 'var(--offset)';
      break;
    case 2:
      tileStyle['--hex-colour'] = 'var(--contrast)';
      break;
  }

  if (props.tile.playable === false) {
    tileStyle['--hex-colour'] = 'transparent';
  }

  if (props.tile.statuses.some((status) => status.type === TileStatusType.captureHighlight)) {
    tileStyle['--hex-colour'] = 'red';
  } else if (props.tile.statuses.some((status) => status.type === TileStatusType.moveHighlight)) {
    tileStyle['--hex-colour'] = 'yellow';
  }

  const handlePieceClick = () => {
    if (piece !== null) {
      if (highlightActive) {
        dispatch(unhighlightMoves(piece));
        dispatch(selectTile(null));
      } else {
        dispatch(highlightMoves(piece));
        dispatch(selectTile(props.tile.axial));
      }
    }
    setHighlightActive(!highlightActive);
  };

  return (
    <div className="tile" style={tileStyle}>
      <div className="relative-parent">
        <div className="hex">
          <div className="hex-left"></div>
          <div className="hex-mid"></div>
          <div className="hex-right"></div>
        </div>
        <div className="piece-container">
          {piece !== null ? (
            <div
              className={`piece-wrapper ${selected ? 'selected' : ''}`}
              style={wrapperStyle as any}
              onClick={handlePieceClick}
            >
              <FontAwesomeIcon icon={PieceToIcon.get(piece.type) as IconDefinition} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RenderTile;
