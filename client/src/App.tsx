import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import CreateGameDialogue from './Components/CreateGameDialogue';
import GameCanvas from './Components/GameCanvas';
import JoinGameDialogue from './Components/JoinGameDialogue';
import Menu from './Components/Menu';
import { resetBoard } from './State/Slices/gameSlice';
import './Styles/dialogue.css';
import './Styles/uibutton.css';
import { wsConnect, wsDisconnect } from './websocketMiddleware';

let socketURL = `${window.location.hostname}:5000`;

function App() {
  const dispatch = useDispatch();

  const firstLoad = useRef(true);
  if (firstLoad.current) {
    // This runs twice but I think only in dev mode(???)
    dispatch(resetBoard());
    firstLoad.current = false;
  }

  useEffect(() => {
    console.log(socketURL);
    dispatch(wsConnect(socketURL));
    return () => {
      dispatch(wsDisconnect(socketURL));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Menu />
      <GameCanvas />
      <CreateGameDialogue />
      <JoinGameDialogue />
    </div>
  );
}

export default App;
