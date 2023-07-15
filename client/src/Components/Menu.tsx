import { useDispatch } from 'react-redux';

interface Props {}

const Menu = (props: Props) => {
  const dispatch = useDispatch();
  const onClickPlayLocal = () => {
    // dispatch(setActiveGame(true));
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };
  return (
    <div className="menu">
      <div className="menu-op" onClick={onClickPlayLocal}>
        Play Local Game
      </div>
      <div className="menu-op">
        <div>Create Online Game</div> <div style={{ fontSize: '0.75rem' }}>(Under Construction)</div>
      </div>
      <div className="menu-op">
        <div>Join Online Game</div> <div style={{ fontSize: '0.75rem' }}>(Under Construction)</div>
      </div>
    </div>
  );
};

export default Menu;
