import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveDialogue, setPlayerName } from '../../State/Slices/appSlice';
import { RootState } from '../../State/rootReducer';
import { Dialogue, ZIndices } from '../../types';
import { wsFindGame } from '../../websocketMiddleware';

interface Props {}

const FindGameDialogue = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeDialogue = useSelector((state: RootState) => state.app.activeDialogue);

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
    if (activeDialogue === Dialogue.FindGame) {
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

  const findButtonOnClick = () => {
    dispatch(wsFindGame());
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
          <div className="dialogue-section"></div>
          <div className="dialogue-section">
            <div className="dialogue-controls">
              <div className="ui-button close fill" onClick={closeButtonOnClick}>
                <FontAwesomeIcon icon={faXmark} />
              </div>
              <div className="ui-button fill with-text" onClick={findButtonOnClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                Search
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindGameDialogue;
