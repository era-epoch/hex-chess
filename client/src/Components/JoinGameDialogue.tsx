import { faRightToBracket, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveDialogue } from '../State/Slices/appSlice';
import { RootState } from '../State/rootReducer';
import { Dialogue, ZIndices } from '../types';

interface Props {}

const JoinGameDialogue = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeDialogue = useSelector((state: RootState) => state.app.activeDialogue);
  const [gameId, setGameId] = useState('');

  // Transition state
  const shown = activeDialogue === Dialogue.JoinGame;
  const fadeOutDuration = 1000;
  const [hiding, setHiding] = useState(false);
  const fadingIn = useRef(false);
  if (shown && !fadingIn.current) {
    fadingIn.current = true;
  }

  const closeButtonOnClick = () => {
    setHiding(true);
    setTimeout(() => {
      dispatch(setActiveDialogue(Dialogue.none));
      setHiding(false);
      fadingIn.current = false;
    }, fadeOutDuration);
  };

  const handleGameIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameId(event.target.value);
  };

  const joinButtonOnClick = () => {};

  return (
    <div
      className={`dialogue ${fadingIn ? 'fade-in' : ''} ${hiding ? 'fade-out' : ''} ${shown ? '' : 'nodisplay'}`}
      style={{ '--fade-duration': `${fadeOutDuration}ms`, zIndex: `${ZIndices.Dialogues}` } as React.CSSProperties}
    >
      <div className="dialogue-internal">
        <div className="dialogue-content join-game-content">
          <div className="dialogue-section">
            <b>Enter Game ID</b>
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
