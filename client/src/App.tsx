import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AlertBox from './Components/AlertBox';
import GameToAppCoordinator from './Components/Coordinators/GameToAppCoordinator';
import OnlineMoveCoordinator from './Components/Coordinators/OnlineMoveCoordinator';
import CreateGameDialogue from './Components/Dialogues/CreateGameDialogue';
import FindGameDialogue from './Components/Dialogues/FindGameDialogue';
import GameLobbyDialogue from './Components/Dialogues/GameLobbyDialogue';
import JoinGameDialogue from './Components/Dialogues/JoinGameDialogue';
import GameCanvas from './Components/GameCanvas';
import Menu from './Components/Menu';
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
    // Will run twice in development (due to strict mode)
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
      <FindGameDialogue />
      <AlertBox />
      <OnlineMoveCoordinator />
      <GameToAppCoordinator />
    </div>
  );
}

export default App;
