import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import GameCanvas from './Components/GameCanvas';
import { resetBoard } from './State/Slices/gameSlice';

function App() {
  const dispatch = useDispatch();
  const firstLoad = useRef(true);
  if (firstLoad.current) {
    dispatch(resetBoard());
    firstLoad.current = false;
  }
  return (
    <div className="App">
      <GameCanvas />
    </div>
  );
}

export default App;
