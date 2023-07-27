import { faChessKing } from '@fortawesome/free-regular-svg-icons';
import { faDice, faPlay, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveDialogue } from '../State/Slices/appSlice';
import { RootState } from '../State/rootReducer';
import { Dialogue, PlayerSide, ZIndices } from '../types';

interface Props {}

const CreateGameDialogue = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeDialogue = useSelector((state: RootState) => state.app.activeDialogue);
  const onlineGameId = useSelector((state: RootState) => state.app.onlineGameId);

  const [playerName, setPlayerName] = useState('Player' + Math.random().toString().slice(-4, -1));
  const [playerSide, setPlayerSide] = useState(PlayerSide.random);

  // Transition state
  const shown = activeDialogue === Dialogue.CreateGame;
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

  const startButtonOnClick = () => {};

  const handlePlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value);
  };

  return (
    <div
      className={`dialogue ${fadingIn ? 'fade-in' : ''} ${hiding ? 'fade-out' : ''} ${shown ? '' : 'nodisplay'}`}
      style={{ '--fade-duration': `${fadeOutDuration}ms`, zIndex: `${ZIndices.Dialogues}` } as React.CSSProperties}
    >
      <div className="dialogue-internal">
        <div className="dialogue-content">
          <div className="dialogue-section">
            <b>Your Game ID</b>
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
            <div
              className={`promo-option no-effects ${playerSide === PlayerSide.white ? '' : 'small'}`}
              onClick={() => {
                setPlayerSide(PlayerSide.white);
              }}
            >
              <FontAwesomeIcon icon={faChessKing} />
            </div>
            <div
              className={`promo-option no-effects inverted ${playerSide === PlayerSide.black ? '' : 'small'}`}
              onClick={() => {
                setPlayerSide(PlayerSide.black);
              }}
            >
              <FontAwesomeIcon icon={faChessKing} />
            </div>
            <div
              className={`promo-option no-effects ${playerSide === PlayerSide.random ? '' : 'small'}`}
              onClick={() => {
                setPlayerSide(PlayerSide.random);
              }}
            >
              <FontAwesomeIcon icon={faDice} />
            </div>
          </div>
          <div className="dialogue-section">
            <div className="dialogue-controls">
              <div className="ui-button close fill" onClick={closeButtonOnClick}>
                <FontAwesomeIcon icon={faXmark} />
              </div>
              <div className="ui-button fill" onClick={startButtonOnClick}>
                <FontAwesomeIcon icon={faPlay} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGameDialogue;
