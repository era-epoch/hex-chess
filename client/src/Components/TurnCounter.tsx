import { useSelector } from 'react-redux';
import { RootState } from '../State/rootReducer';
import { GameOverState } from '../types';
interface Props {}

const TurnCounter = (props: Props): JSX.Element => {
  const activeGame = useSelector((state: RootState) => state.app.activeGame);
  const gameOverState = useSelector((state: RootState) => state.game.gameOverState);
  const turn = useSelector((state: RootState) => state.game.turn);
  let player = 'Black';
  if (turn % 2 === 1) {
    player = 'White';
  }

  let gameOverMsg = '';
  switch (gameOverState) {
    case GameOverState.blackStalemated:
      gameOverMsg = 'Black is Stalemated (White wins 0.75)';
      break;
    case GameOverState.whiteStalemated:
      gameOverMsg = 'White is Stalemated (Black wins 0.75)';
      break;
    case GameOverState.blackVictory:
      gameOverMsg = 'Black wins!';
      break;
    case GameOverState.whiteVictory:
      gameOverMsg = 'White wins!';
      break;
  }

  return (
    <div className={`turn-counter-container ${activeGame ? '' : 'nodisplay'}`}>
      <div className="counter">
        Turn {turn} ({player})
      </div>
      {gameOverState !== GameOverState.unfinished ? <div className="game-over">Game Over! {gameOverMsg}</div> : null}
    </div>
  );
};

export default TurnCounter;
