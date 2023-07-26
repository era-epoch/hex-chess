import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveDialogue } from '../State/Slices/appSlice';
import { RootState } from '../State/rootReducer';
import { Dialogue } from '../types';

interface Props {}

const DialogueSkeleton = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeDialogue = useSelector((state: RootState) => state.app.activeDialogue);

  // Transition state
  const shown = activeDialogue === Dialogue.none;
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

  return (
    <div
      className={`dialogue ${fadingIn ? 'fade-in' : ''} ${hiding ? 'fade-out' : ''} ${shown ? '' : 'nodisplay'}`}
      style={{ '--fade-duration': `${fadeOutDuration}ms` } as React.CSSProperties}
    >
      <div className="dialogue-internal">
        <div className="dialogue-content">
          <div className="dialogue-section">Content</div>
          <div className="dialogue-section">
            <div className="dialogue-controls">
              <div className="dialogue-close ui-button round" onClick={closeButtonOnClick}>
                <FontAwesomeIcon icon={faXmark} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueSkeleton;
