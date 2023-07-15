import { useSelector } from 'react-redux';
import { RootState } from '../State/rootReducer';
interface Props {}

const TurnCounter = (props: Props): JSX.Element => {
  const activeGame = useSelector((state: RootState) => state.app.activeGame);
  const turn = useSelector((state: RootState) => state.game.turn);
  let player = 'Black';
  if (turn % 2 === 1) {
    player = 'White';
  }
  return (
    <div className={`turn-counter-container ${activeGame ? '' : 'nodisplay'}`}>
      <div className="counter">
        Turn {turn} ({player})
      </div>
    </div>
  );
};

export default TurnCounter;
