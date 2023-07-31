import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pushLogItem } from '../../State/Slices/appSlice';
import { RootState } from '../../State/rootReducer';

interface Props {}

const GameToAppCoordinator = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const lastMoveString = useSelector((state: RootState) => state.game.lastMoveString);
  const prev = useRef('');

  if (lastMoveString !== '' && lastMoveString !== prev.current) {
    dispatch(pushLogItem({ content: lastMoveString, source: 'Move', timestamp: Date.now() }));
    prev.current = lastMoveString;
  }

  return <div className="game-to-app-coordinator"></div>;
};

export default GameToAppCoordinator;
