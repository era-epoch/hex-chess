import { faChessBishop, faChessKnight, faChessQueen, faChessRook } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { executePromotePiece } from '../State/Slices/gameSlice';
import { RootState } from '../State/rootReducer';
import { PieceType, ZIndices } from '../types';

interface Props {}

const PromotionDialogue = (props: Props): JSX.Element => {
  const dispatch = useDispatch();

  // Transition state
  const shown = useSelector((state: RootState) => state.game.pawnPromotionFlag);
  const fadeOutDuration = 1000;
  const [hiding, setHiding] = useState(false);
  const fadingIn = useRef(false);
  if (shown && !fadingIn.current) {
    fadingIn.current = true;
  }

  const promotePiece = (piece: PieceType) => {
    dispatch(executePromotePiece(piece));
    closeDialogue();
  };

  const closeDialogue = () => {
    setHiding(true);
    setTimeout(() => {
      setHiding(false);
      fadingIn.current = false;
    }, fadeOutDuration);
  };

  return (
    <div
      className={`dialogue ${fadingIn ? 'fade-in' : ''} ${hiding ? 'fade-out' : ''} ${shown ? '' : 'nodisplay'}`}
      id="promotion-dialogue"
      style={{ '--fade-duration': `${fadeOutDuration}ms`, zIndex: `${ZIndices.Dialogues + 1}` } as React.CSSProperties}
    >
      <div className="dialogue-internal">
        <div className="dialogue-content">
          <div className="dialogue-section promo-title">Promote Pawn to ...</div>
          <div className="dialogue-section">
            <div className="promo-options">
              <div className="promo-option" onClick={() => promotePiece(PieceType.queen)}>
                <FontAwesomeIcon icon={faChessQueen} />
              </div>
              <div className="promo-option" onClick={() => promotePiece(PieceType.knight)}>
                <FontAwesomeIcon icon={faChessKnight} />
              </div>
              <div className="promo-option" onClick={() => promotePiece(PieceType.rook)}>
                <FontAwesomeIcon icon={faChessRook} />
              </div>
              <div className="promo-option" onClick={() => promotePiece(PieceType.bishop)}>
                <FontAwesomeIcon icon={faChessBishop} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDialogue;
