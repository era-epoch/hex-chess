import CSS from 'csstype';
import { useSelector } from 'react-redux';
import { RootState } from '../State/rootReducer';
import { PlayerSide } from '../types';
import PromotionDialogue from './Dialogues/PromotionDialogue';
import RenderTile from './RenderTile';
import TurnCounter from './TurnCounter';

interface Props {}

const GameCanvas = (props: Props): JSX.Element => {
  const board = useSelector((state: RootState) => state.game.board);
  const localSide = useSelector((state: RootState) => state.game.localSide);
  const tilePadding = 0;

  const limitingFactor = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight - 50;
  const tileHexSize = Math.floor((limitingFactor - 11 * tilePadding) / (12 * Math.sqrt(3)));
  const hexColour = 'var(--contrast)';

  const canvasStyle: CSS.Properties = {
    width: `${board.length * (tileHexSize * 1.5) + (board.length - 1) * tilePadding + tileHexSize / 2}px`,
    height: `${(board.length + 0.5) * (tileHexSize * Math.sqrt(3) + tilePadding)}px`,
  };

  const tileStyles: CSS.Properties | any[][] = [];
  for (const col of board) {
    tileStyles.push([]);
    for (const tile of col) {
      let style: CSS.Properties | any;
      if (localSide === PlayerSide.black) {
        style = {
          width: `${tileHexSize * 2}px`,
          height: `${tileHexSize * Math.sqrt(3)}px`,
          left: `${
            (board.length - 1 - tile.pos.col) * tileHexSize * 1.5 + (board.length - 1 - tile.pos.col) * tilePadding
          }px`,
          top: `${
            (board[0].length - tile.pos.row) * tileHexSize * Math.sqrt(3) +
            (board[0].length + 0.5 - tile.pos.row) * tilePadding
          }px`,
          '--hex-size': `${tileHexSize}px`,
          '--hex-h': `${tileHexSize * Math.sqrt(3)}px`,
          '--hex-colour': `${hexColour}`,
        };
        if (tile.pos.col % 2 === 1) {
          style.top = `${
            (board[0].length - tile.pos.row - 0.5) * tileHexSize * Math.sqrt(3) +
            (board[0].length - tile.pos.row - 0.5) * tilePadding +
            tilePadding / 2
          }px`;
        }
      } else {
        style = {
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
      }

      tileStyles[tile.pos.col].push(style);
    }
  }

  return (
    <div className="game-canvas" style={canvasStyle}>
      <div className="board">
        {board.map((col, i) => {
          return (
            <div className="column" key={i}>
              {col.map((tile, j) => {
                return <RenderTile tile={tile} tileStyle={tileStyles[i][j]} key={j} />;
              })}
            </div>
          );
        })}
      </div>
      <TurnCounter />
      <PromotionDialogue />
    </div>
  );
};

export default GameCanvas;
