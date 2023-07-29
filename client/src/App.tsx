import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AlertBox from './Components/AlertBox';
import CreateGameDialogue from './Components/CreateGameDialogue';
import GameCanvas from './Components/GameCanvas';
import GameLobbyDialogue from './Components/GameLobbyDialogue';
import JoinGameDialogue from './Components/JoinGameDialogue';
import Menu from './Components/Menu';
import OnlineMoveCoordinator from './Components/OnlineMoveCoordinator';
import { resetBoard } from './State/Slices/gameSlice';
import './Styles/alert.css';
import './Styles/dialogue.css';
import './Styles/uibutton.css';
import { wsConnect, wsDisconnect } from './websocketMiddleware';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetBoard());
    dispatch(wsConnect());
    return () => {
      dispatch(wsDisconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Menu />
      <GameCanvas />
      <CreateGameDialogue />
      <JoinGameDialogue />
      <GameLobbyDialogue />
      <AlertBox />
      <OnlineMoveCoordinator />
    </div>
  );
}

export default App;
