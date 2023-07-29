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
import { IS_PROD } from './env';
import { wsConnect, wsDisconnect } from './websocketMiddleware';

let socketURL: string;
if (IS_PROD) {
  socketURL = `${window.location.hostname}:5000`;
} else {
  socketURL = `https://www.hex-chess.io:5000`;
}

function App() {
  const dispatch = useDispatch();

  // const firstLoad = useRef(true);
  // if (firstLoad.current) {
  //   // This runs twice but I think only in dev mode(???)
  //   dispatch(resetBoard());
  //   firstLoad.current = false;
  // }

  useEffect(() => {
    console.log(socketURL);
    dispatch(resetBoard());
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
      <GameLobbyDialogue />
      <AlertBox />
      <OnlineMoveCoordinator />
    </div>
  );
}

export default App;
