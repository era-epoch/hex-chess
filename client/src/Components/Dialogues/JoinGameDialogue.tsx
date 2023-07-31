import { faRightToBracket, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveDialogue, setPlayerName } from '../../State/Slices/appSlice';
import { RootState } from '../../State/rootReducer';
import { Dialogue, ZIndices } from '../../types';
import { wsJoinGame } from '../../websocketMiddleware';

interface Props {}

const JoinGameDialogue = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeDialogue = useSelector((state: RootState) => state.app.activeDialogue);
  const [gameId, setGameId] = useState('');

  const playerName = useSelector((state: RootState) => state.app.playerName);

  // Transition state
  const [shown, setShown] = useState(false);
  const [hiding, setHiding] = useState(false);
  const fadeOutDuration = 1000;
  const fadingIn = useRef(false);
  const hasShown = useRef(false);
  if (shown && !fadingIn.current) {
    fadingIn.current = true;
  }

  useEffect(() => {
    if (activeDialogue === Dialogue.JoinGame) {
      setShown(true);
      hasShown.current = true;
    } else if (!hasShown.current) {
      return;
    } else {
      setHiding(true);
      setTimeout(() => {
        setShown(false);
        setHiding(false);
        fadingIn.current = false;
      }, fadeOutDuration);
    }
  }, [activeDialogue]);

  const closeButtonOnClick = () => {
    dispatch(setActiveDialogue(Dialogue.none));
  };

  const handleGameIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameId(event.target.value);
  };

  const joinButtonOnClick = () => {
    dispatch(wsJoinGame(gameId, playerName));
  };

  const handlePlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPlayerName(event.target.value));
  };

  return (
    <div
      className={`dialogue ${fadingIn ? 'fade-in' : ''} ${hiding ? 'fade-out' : ''} ${shown ? '' : 'nodisplay'}`}
      style={{ '--fade-duration': `${fadeOutDuration}ms`, zIndex: `${ZIndices.Dialogues}` } as React.CSSProperties}
    >
      <div className="dialogue-internal">
        <div className="dialogue-content join-game-content">
          <div className="dialogue-section">
            <b>Your Name</b>
          </div>
          <div className="dialogue-section">
            <input type="text" value={playerName} onChange={handlePlayerNameChange} />
          </div>
          <div className="dialogue-section">
            <b>Game ID</b>
          </div>
          <div className="dialogue-section">
            <input type="text" value={gameId} onChange={handleGameIdChange} />
          </div>
          <div className="dialogue-section"></div>
          <div className="dialogue-section">
            <div className="dialogue-controls">
              <div className="ui-button close fill" onClick={closeButtonOnClick}>
                <FontAwesomeIcon icon={faXmark} />
              </div>
              <div className="ui-button fill with-text" onClick={joinButtonOnClick}>
                <FontAwesomeIcon icon={faRightToBracket} />
                Join
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGameDialogue;
