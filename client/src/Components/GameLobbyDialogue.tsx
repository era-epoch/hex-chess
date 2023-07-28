import { faChessKing } from '@fortawesome/free-regular-svg-icons';
import { faDice, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveDialogue, setPlayerName } from '../State/Slices/appSlice';
import { RootState } from '../State/rootReducer';
import { Dialogue, PlayerSide, ZIndices } from '../types';

interface Props {}

const GameLobbyDialogue = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeDialogue = useSelector((state: RootState) => state.app.activeDialogue);
  const onlineGameId = useSelector((state: RootState) => state.app.onlineGameId);
  const playerName = useSelector((state: RootState) => state.app.playerName);
  const playerSide = useSelector((state: RootState) => state.app.playerSide);

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
    if (activeDialogue === Dialogue.CreateGame) {
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

  const handlePlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPlayerName(event.target.value));
  };

  return (
    <div
      className={`dialogue ${fadingIn ? 'fade-in' : ''} ${hiding ? 'fade-out' : ''} ${shown ? '' : 'nodisplay'}`}
      style={{ '--fade-duration': `${fadeOutDuration}ms`, zIndex: `${ZIndices.Dialogues}` } as React.CSSProperties}
    >
      <div className="dialogue-internal">
        <div className="dialogue-content">
          <div className="dialogue-section">
            <b>Game ID</b>
          </div>
          <div className="dialogue-section">{onlineGameId}</div>
          <div className="dialogue-section">
            <b>Your Name</b>
          </div>
          <div className="dialogue-section">
            <input type="text" value={playerName} onChange={handlePlayerNameChange} />
          </div>
          <div className="dialogue-section">
            <b>Your Opponent</b>
          </div>
          <div className="dialogue-section">Waiting for player to join ...</div>
          <div className="dialogue-section">
            <b>Your side</b>
          </div>
          <div className="dialogue-section side-selection">
            <div className={`promo-option no-effects ${playerSide === PlayerSide.white ? '' : 'small'}`}>
              <FontAwesomeIcon icon={faChessKing} />
            </div>
            <div className={`promo-option no-effects inverted ${playerSide === PlayerSide.black ? '' : 'small'}`}>
              <FontAwesomeIcon icon={faChessKing} />
            </div>
            <div className={`promo-option no-effects ${playerSide === PlayerSide.random ? '' : 'small'}`}>
              <FontAwesomeIcon icon={faDice} />
            </div>
          </div>
          <div className="dialogue-section">
            <div className="dialogue-controls">
              <div className="ui-button close fill" onClick={closeButtonOnClick}>
                <FontAwesomeIcon icon={faXmark} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobbyDialogue;
