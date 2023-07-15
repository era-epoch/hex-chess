import { useDispatch } from 'react-redux';
import { setActiveGame } from '../State/Slices/appSlice';

interface Props {}

const Menu = (props: Props) => {
  const dispatch = useDispatch();
  const onClickPlayLocal = () => {
    dispatch(setActiveGame(true));
  };
  return (
    <div className="menu">
      <div className="menu-op" onClick={onClickPlayLocal}>
        Play Local Game
      </div>
      <div className="menu-op">Create Online Game</div>
      <div className="menu-op">Join Online Game</div>
    </div>
  );
};

export default Menu;
