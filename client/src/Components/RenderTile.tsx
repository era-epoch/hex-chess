import { IconDefinition, faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CSS from 'csstype';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PieceToIcon } from '../State/Pieces/maps';
import { attemptMove, highlightMoves, selectTile, unhighlightAllMoves } from '../State/Slices/gameSlice';
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
    selected = selectedTile.id === props.tile.id;
  }

  const [highlightActive, setHighlightActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  const wrapperStyle = {
    '--piece-color': 'white',
    '--piece-contrast': 'black',
  };

  if (piece !== null) {
    if (piece.owner === PieceOwner.black) {
      if (selected) {
        wrapperStyle['--piece-color'] = 'var(--primary-dark)';
      } else {
        wrapperStyle['--piece-color'] = 'black';
      }
      wrapperStyle['--piece-contrast'] = 'white';
    } else {
      if (selected) {
        wrapperStyle['--piece-color'] = 'var(--primary-light)';
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

  if (hovering) {
    tileStyle['--hex-colour'] = 'var(--primary)';
  }

  if (props.tile.playable === false) {
    tileStyle['--hex-colour'] = 'transparent';
  }

  if (props.tile.statuses.some((status) => status.type === TileStatusType.captureHighlight)) {
    tileStyle['--hex-colour'] = 'red';
    tileStyle['cursor'] = 'pointer';
  } else if (props.tile.statuses.some((status) => status.type === TileStatusType.moveHighlight)) {
    tileStyle['--hex-colour'] = 'var(--primary)';
    tileStyle['cursor'] = 'pointer';
  }

  // if (props.tile.statuses.some((status) => status.type === TileStatusType.whitePromoTile)) {
  //   tileStyle['--hex-colour'] = 'purple';
  // }

  const handlePieceClick = (e: React.MouseEvent<HTMLElement>) => {
    if (piece !== null) {
      if (props.tile.statuses.some((status) => status.type === TileStatusType.captureHighlight)) return;
      if (highlightActive) {
        dispatch(unhighlightAllMoves());
        dispatch(selectTile(null));
      } else {
        dispatch(highlightMoves(piece));
        dispatch(selectTile(props.tile));
      }
    }
    setHighlightActive(!highlightActive);
  };

  const handleTileClick = (e: React.MouseEvent<HTMLElement>) => {
    console.log('Clicked: ', props.tile.axial);
    dispatch(attemptMove(props.tile.axial));
  };

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  return (
    <div
      className="tile"
      style={tileStyle}
      onClick={handleTileClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
        <div className="piece-silhouette-container">
          {hovering &&
          selectedTile?.content !== null &&
          props.tile.statuses.some((status) => status.type === TileStatusType.moveHighlight) ? (
            <FontAwesomeIcon icon={PieceToIcon.get(selectedTile!.content.type) as IconDefinition} />
          ) : null}
          {hovering &&
          selectedTile?.content !== null &&
          props.tile.statuses.some((status) => status.type === TileStatusType.captureHighlight) ? (
            <FontAwesomeIcon icon={faSkullCrossbones} className="kill" />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RenderTile;
