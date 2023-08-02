import { useDispatch, useSelector } from 'react-redux';
import { setActiveDialogue } from '../State/Slices/appSlice';
import { RootState } from '../State/rootReducer';
import { Dialogue } from '../types';
import { wsCreateGame } from '../websocketMiddleware';

interface Props {}

const Menu = (props: Props) => {
  const dispatch = useDispatch();
  const onlineGameId = useSelector((state: RootState) => state.app.onlineGameId);
  const onClickPlayLocal = () => {
    // dispatch(setActiveGame(true));
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };
  const onClickCreateGame = () => {
    if (onlineGameId === null) {
      dispatch(wsCreateGame());
    } else {
      dispatch(setActiveDialogue(Dialogue.CreateGame));
    }
  };
  const onClickJoinGame = () => {
    dispatch(setActiveDialogue(Dialogue.JoinGame));
  };
  const onClickFindGame = () => {
    dispatch(setActiveDialogue(Dialogue.FindGame));
  };
  const onClickSupport = () => {
    window.open('https://www.patreon.com/eracodes', '_blank');
  };
  const onClickBugs = () => {
    window.open('https://github.com/era-epoch/hex-chess', '_blank');
  };
  return (
    <div className="menu">
      <div className="menu-op" onClick={onClickPlayLocal}>
        Play Offline Game
      </div>
      <div className="menu-op" onClick={onClickFindGame}>
        Find Online Game
        <div className="menu-subtitle">(Experimental)</div>
      </div>
      <div className="menu-op" onClick={onClickCreateGame}>
        <div>Create Private Game</div>
      </div>
      <div className="menu-op" onClick={onClickJoinGame}>
        <div>Join Private Game</div>
      </div>
      <div className="menu-op small" onClick={onClickSupport}>
        <div>Support the Developer</div>
      </div>
      <div className="menu-op small" onClick={onClickBugs}>
        <div>Bugs and Feature Requests</div>
      </div>
    </div>
  );
};

export default Menu;
