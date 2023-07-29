import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pushLogItem } from '../State/Slices/appSlice';
import { RootState } from '../State/rootReducer';
import '../Styles/sidebar.css';
import { wsSendChat } from '../websocketMiddleware';

interface Props {}

const Sidebar = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const log = useSelector((state: RootState) => state.app.log);
  const playerName = useSelector((state: RootState) => state.app.playerName);
  const onlineGameId = useSelector((state: RootState) => state.app.onlineGameId);

  const [chatMsg, setChatMsg] = useState('');
  const handleChatInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatMsg(event.target.value);
  };

  const sendMessage = () => {
    if (chatMsg === '') return;
    const item = { content: chatMsg, source: playerName, timestamp: Date.now() };
    dispatch(pushLogItem(item));
    dispatch(wsSendChat(onlineGameId!, item));
    setChatMsg('');
  };

  const msgInputKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <div className="log-container">
          <div className="log">
            {log.map((item, i) => {
              return (
                <div className="log-item" key={i}>
                  <div className="log-source">{item.source}:</div>
                  <div className="log-content" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                </div>
              );
            })}
          </div>
          <div className="chat-input">
            <input value={chatMsg} onChange={handleChatInputChange} onKeyDown={msgInputKeydown} />
            <div className="chat-enter" onClick={sendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
