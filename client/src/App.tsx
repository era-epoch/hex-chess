import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import GameCanvas from './Components/GameCanvas';
import Menu from './Components/Menu';
import { resetBoard } from './State/Slices/gameSlice';
import './Styles/dialogue.css';

function App() {
  const dispatch = useDispatch();
  const firstLoad = useRef(true);
  if (firstLoad.current) {
    // This runs twice but I think only in dev mode(???)
    dispatch(resetBoard());
    firstLoad.current = false;
  }
  return (
    <div className="App">
      <Menu />
      <GameCanvas />
    </div>
  );
}

export default App;
