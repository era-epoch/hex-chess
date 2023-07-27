import { useDispatch } from 'react-redux';
import { setActiveDialogue } from '../State/Slices/appSlice';
import { Dialogue } from '../types';
import { wsCreateGame } from '../websocketMiddleware';

interface Props {}

const Menu = (props: Props) => {
  const dispatch = useDispatch();
  const onClickPlayLocal = () => {
    // dispatch(setActiveGame(true));
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };
  const onClickCreateGame = () => {
    dispatch(wsCreateGame());
  };
  const onClickJoinGame = () => {
    dispatch(setActiveDialogue(Dialogue.JoinGame));
  };
  return (
    <div className="menu">
      <div className="menu-op" onClick={onClickPlayLocal}>
        Play Local Game
      </div>
      <div className="menu-op" onClick={onClickCreateGame}>
        <div>Create Online Game</div> <div style={{ fontSize: '0.75rem' }}>(Under Construction)</div>
      </div>
      <div className="menu-op" onClick={onClickJoinGame}>
        <div>Join Online Game</div> <div style={{ fontSize: '0.75rem' }}>(Under Construction)</div>
      </div>
    </div>
  );
};

export default Menu;
