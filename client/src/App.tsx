import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AlertBox from './Components/AlertBox';
import CreateGameDialogue from './Components/CreateGameDialogue';
import GameCanvas from './Components/GameCanvas';
import GameLobbyDialogue from './Components/GameLobbyDialogue';
import GameToAppCoordinator from './Components/GameToAppCoordinator';
import JoinGameDialogue from './Components/JoinGameDialogue';
import Menu from './Components/Menu';
import OnlineMoveCoordinator from './Components/OnlineMoveCoordinator';
import Sidebar from './Components/Sidebar';
import { pushLogItem } from './State/Slices/appSlice';
import { resetBoard } from './State/Slices/gameSlice';
import './Styles/alert.css';
import './Styles/dialogue.css';
import './Styles/uibutton.css';
import { wsConnect, wsDisconnect } from './websocketMiddleware';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // This runs twice but only in development (due to strict mode)
    dispatch(resetBoard());
    dispatch(pushLogItem({ content: 'Welcome to Hex-Chess.io!', source: 'Game', timestamp: Date.now() }));
    dispatch(wsConnect());
    return () => {
      dispatch(wsDisconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Menu />
      <Sidebar />
      <GameCanvas />
      <CreateGameDialogue />
      <JoinGameDialogue />
      <GameLobbyDialogue />
      <AlertBox />
      <OnlineMoveCoordinator />
      <GameToAppCoordinator />
    </div>
  );
}

export default App;
