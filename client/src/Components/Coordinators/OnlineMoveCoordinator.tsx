import { useDispatch, useSelector } from 'react-redux';
import { setSendMoveFlag } from '../../State/Slices/gameSlice';
import { RootState } from '../../State/rootReducer';
import { wsSendMove } from '../../websocketMiddleware';

interface Props {}

const OnlineMoveCoordinator = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const lastMove = useSelector((state: RootState) => state.game.lastMove);
  const roomId = useSelector((state: RootState) => state.app.onlineGameId);
  const sendMoveFlag = useSelector((state: RootState) => state.game.sendMoveFlag);

  if (sendMoveFlag) {
    console.log('Sending move');
    dispatch(wsSendMove(roomId!, lastMove!));
    dispatch(setSendMoveFlag(false));
  }

  return <div className="online-move-coordinator"></div>;
};

export default OnlineMoveCoordinator;
