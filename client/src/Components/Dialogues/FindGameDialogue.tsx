import {
  faChessBishop,
  faChessKing,
  faChessKnight,
  faChessPawn,
  faChessQueen,
  faChessRook,
  faMagnifyingGlass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  pushAlert,
  pushLogItem,
  setActiveDialogue,
  setPlayerName,
  setSearchingForGame,
} from '../../State/Slices/appSlice';
import { RootState } from '../../State/rootReducer';
import { AlertSeverity, Dialogue, ZIndices } from '../../types';
import { createAlert } from '../../utility';
import { wsCancelFindGame, wsFindGame } from '../../websocketMiddleware';

interface Props {}

const FindGameDialogue = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeDialogue = useSelector((state: RootState) => state.app.activeDialogue);
  const playerName = useSelector((state: RootState) => state.app.playerName);
  const searching = useSelector((state: RootState) => state.app.searchingForGame);

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
    if (searching) {
      dispatch(setSearchingForGame(false));
      dispatch(wsCancelFindGame());
      dispatch(pushLogItem({ content: 'Exited matchmaking queue', source: 'Game', timestamp: Date.now() }));
      dispatch(pushAlert(createAlert('Search canceled', AlertSeverity.error)));
    } else {
      dispatch(setActiveDialogue(Dialogue.none));
    }
  };

  const findButtonOnClick = () => {
    if (searching) return;
    dispatch(setSearchingForGame(true));
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
          {searching ? (
            <div className="dialogue-section col">
              <div className="searching-title">Searching for a match</div>
              <div className="searching-graphic">
                <div className="icon loading-rotate" style={{ '--anim-delay': '0ms' } as React.CSSProperties}>
                  <FontAwesomeIcon icon={faChessPawn} />
                </div>
                <div className="icon loading-rotate" style={{ '--anim-delay': '100ms' } as React.CSSProperties}>
                  <FontAwesomeIcon icon={faChessKnight} />
                </div>
                <div className="icon loading-rotate" style={{ '--anim-delay': '200ms' } as React.CSSProperties}>
                  <FontAwesomeIcon icon={faChessBishop} />
                </div>
                <div className="icon loading-rotate" style={{ '--anim-delay': '300ms' } as React.CSSProperties}>
                  <FontAwesomeIcon icon={faChessRook} />
                </div>
                <div className="icon loading-rotate" style={{ '--anim-delay': '400ms' } as React.CSSProperties}>
                  <FontAwesomeIcon icon={faChessQueen} />
                </div>
                <div className="icon loading-rotate" style={{ '--anim-delay': '500ms' } as React.CSSProperties}>
                  <FontAwesomeIcon icon={faChessKing} />
                </div>
              </div>
            </div>
          ) : null}
          <div className="dialogue-section">
            <div className="dialogue-controls">
              <div className="ui-button close fill" onClick={closeButtonOnClick}>
                <FontAwesomeIcon icon={faXmark} />
                {searching ? 'Cancel Search' : 'Close'}
              </div>
              {searching ? null : (
                <div className="ui-button fill with-text" onClick={findButtonOnClick}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                  Search
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindGameDialogue;
