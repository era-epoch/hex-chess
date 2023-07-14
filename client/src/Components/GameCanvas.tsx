import CSS from 'csstype';
import { useSelector } from 'react-redux';
import { RootState } from '../State/rootReducer';
import RenderTile from './RenderTile';

interface Props {}

const GameCanvas = (props: Props): JSX.Element => {
  const board = useSelector((state: RootState) => state.game.board);
  const tileHexSize = 40;
  const hexColour = 'var(--contrast)';
  const tilePadding = 5;

  const canvasStyle: CSS.Properties = {
    width: `${board.length * (tileHexSize * 1.5) + (board.length - 1) * tilePadding + tileHexSize / 2}px`,
    height: `${(board.length + 0.5) * (tileHexSize * Math.sqrt(3) + tilePadding)}px`,
  };

  const tileStyles: CSS.Properties | any[][] = [];
  for (const col of board) {
    tileStyles.push([]);
    for (const tile of col) {
      const style: CSS.Properties | any = {
        width: `${tileHexSize * 2}px`,
        height: `${tileHexSize * Math.sqrt(3)}px`,
        left: `${tile.pos.col * tileHexSize * 1.5 + tile.pos.col * tilePadding}px`,
        top: `${tile.pos.row * tileHexSize * Math.sqrt(3) + tile.pos.row * tilePadding}px`,
        '--hex-size': `${tileHexSize}px`,
        '--hex-h': `${tileHexSize * Math.sqrt(3)}px`,
        '--hex-colour': `${hexColour}`,
      };
      if (tile.pos.col % 2 === 1) {
        style.top = `${
          (tile.pos.row + 0.5) * tileHexSize * Math.sqrt(3) + tile.pos.row * tilePadding + tilePadding / 2
        }px`;
      }
      tileStyles[tile.pos.col].push(style);
    }
  }

  return (
    <div className="game-canvas" style={canvasStyle}>
      <div className="board">
        {board.map((col, i) => {
          return (
            <div className="column">
              {col.map((tile, j) => {
                return <RenderTile tile={tile} tileStyle={tileStyles[i][j]} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameCanvas;
