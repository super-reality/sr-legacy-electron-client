import React, { useCallback, useEffect, useRef, useState } from "react";
/* eslint-disable-next-line */
import moment from "moment";
import DefaultIcon from "../../../assets/images/default-chat-icon.png";
// import Sonic from "../../../assets/images/sonic.png";
// import Nick from "../../../assets/images/Nick.png";
// import Pacman from "../../../assets/images/pacman.png";
import { ReactComponent as SendButton } from "../../../assets/svg/send.svg";
import "./index.scss";
import client from "../../feathers";
import useDetectOutsideClick from "../../hooks/useDetectOutsideClick";
import { Message } from "../../../types/chat";
import IconEdit from "../../../assets/images/popup-edit.png";
import IconDelete from "../../../assets/images/popup-delete.png";

interface ChatProps {
  messages: Message[];
}

interface User {
  createdAt: string;
  firstname: string;
  lastname: string;
  updatedAt: string;
  username: string;
  _id: string;
  avatar?: string;
}

interface MessageProps {
  _id: string;
  user: User;
  createdAt: string;
  text: string;
}

interface MessageDropdownProps {
  removeMessage: () => void;
  startEditMessage: () => void;
  closeFunction: () => void;
}

function MessageDropdouwn(props: MessageDropdownProps) {
  const { removeMessage, startEditMessage, closeFunction } = props;

  const dots2Ref = useRef<HTMLDivElement>(null);

  useDetectOutsideClick(dots2Ref, closeFunction);

  const deleteMessage = () => {
    removeMessage();
    closeFunction();
  };

  const editMessage = () => {
    startEditMessage();
    closeFunction();
  };
  return (
    <div ref={dots2Ref} className="message-dropdown">
      <div className="dropdown-item">
        <button
          type="button"
          style={{
            cursor: "pointer",
            color: "var(--color-text)",
          }}
          onClick={editMessage}
        >
          Edit Message
          <img src={IconEdit} alt="" />
        </button>
      </div>
      <div className="dropdown-item">
        <button
          type="button"
          style={{
            cursor: "pointer",
            color: "var(--color-text)",
          }}
          onClick={deleteMessage}
        >
          Delete Message
          <img src={IconDelete} alt="" />
        </button>
      </div>
    </div>
  );
}

export function MessageBox(props: MessageProps) {
  const { _id, user, createdAt, text } = props;

  const [isHover, setIsHover] = useState<boolean>(false);
  const [textEdit, setTextEdit] = useState("");
  const [edit, setEdit] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const dotsRef = useRef<HTMLDivElement>(null);

  const showMessageMenu = () => {
    setIsHover(true);
  };

  const hideMessageMenu = () => {
    if (!showMenu) {
      setIsHover(false);
    }
  };
  const closeDropdown = () => {
    setShowMenu(false);
    setIsHover(false);
  };
  const onTextChange = (e: any) => {
    const message = e.target.value;
    setTextEdit(message);
  };

  // convert creation time in needed format
  const messageTime = (unixTimestam: number | string) => {
    // convert time using moment.js lib
    const dateObject = moment(unixTimestam).calendar();
    // console.log("date converted:", dateObject);
    return dateObject;
  };

  // delete message function
  const removeMessage = () => {
    (client as any).service("messages").remove(_id);
  };

  // edit message
  const startEditMessage = () => {
    setTextEdit(text);
    setEdit(true);
  };

  // patch updated message
  const submitEditMessage = (id: string, updatedMessage: string) => {
    (client as any).service("messages").patch(id, {
      text: updatedMessage,
    });
    setEdit(false);
    setTextEdit("");
  };

  const handleEnterDownEdit = (
    id: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      submitEditMessage(id, textEdit);
      setTextEdit("");
    }
  };
  const cancelEditingMessage = () => {
    setEdit(false);
    setTextEdit("");
  };
  const openDropdown = useCallback(() => {
    setShowMenu(!showMenu);
  }, []);

  // Popup menu
  // const [PopupMenu, openMessagePopup] = usePopupMessageMenu({
  //   removeMessage,
  //   startEditMessage,
  // });
  // console.log(user.avatar);
  return (
    <div className={`single-chat ${isHover ? "hovered" : ""}`} key={_id}>
      <img className="avatar" src={user.avatar || DefaultIcon} alt="avatar" />
      <div className="info">
        <div className="user">{user.username}</div>
        <div className="timestamp">{messageTime(createdAt)}</div>
      </div>

      {!edit ? (
        <div
          className="message-box"
          onMouseEnter={showMessageMenu}
          onMouseLeave={hideMessageMenu}
        >
          <div className="message" ref={dotsRef}>
            {text}
          </div>
          {showMenu && (
            <MessageDropdouwn
              removeMessage={removeMessage}
              startEditMessage={startEditMessage}
              closeFunction={closeDropdown}
            />
          )}
          {isHover ? (
            <div className="message-settings-box">
              <button
                type="button"
                className="dots-menu"
                onClick={openDropdown}
              >
                ...
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="chat-input">
          <input
            value={textEdit}
            type="text"
            placeholder="You rock!"
            onChange={onTextChange}
            onKeyDown={(e) => {
              handleEnterDownEdit(_id, e);
            }}
          />
          <button
            type="button"
            style={{
              cursor: "pointer",
              color: "var(--color-text)",
            }}
            onClick={() => {
              cancelEditingMessage();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              cursor: "pointer",
              color: "var(--color-text)",
            }}
            onClick={() => {
              submitEditMessage(_id, textEdit);
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default function Chat(props: ChatProps) {
  const { messages } = props;
  const [textMessage, setTextMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onTextChange = (e: any) => {
    const message = e.target.value;
    setTextMessage(message);
  };

  const sendMessage = (text: string) => {
    if (text !== "") {
      console.log(text);
      client
        .service("messages")
        .create({ text })
        .then((res: any) => {
          console.log("create message res", res);
        });
    }
  };

  const createMessage = (messageContent: string) => {
    sendMessage(messageContent);
    setTextMessage("");
  };
  const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(textMessage);
      setTextMessage("");
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef && messagesEndRef.current) {
      const chat = messagesEndRef.current;
      chat.scrollTop = chat.scrollHeight - chat.clientHeight;
    }
  };
  // scroll to the bottom of the chat when new message is added
  // TO DO create listener
  useEffect(scrollToBottom, [messages]);

  // const dispatch = useDispatch();
  // chat functions
  // const { messages, users } = useSelector((state: AppState) => state.chat);

  return (
    <div className="chat-with-title-container">
      <div className="chat-and-channels-title">Chat</div>
      <div className="chat-container">
        <div className="chats" ref={messagesEndRef}>
          {messages?.map((messageObject: any) => {
            const { _id, user, createdAt, text } = messageObject;
            return (
              <MessageBox
                key={_id}
                _id={_id}
                user={user}
                createdAt={createdAt}
                text={text}
              />
            );
          })}
        </div>

        <div className="chat-input">
          <input
            value={textMessage}
            type="text"
            placeholder="You rock!"
            onChange={onTextChange}
            onKeyDown={handleEnterDown}
          />
          <SendButton
            onClick={() => {
              createMessage(textMessage);
            }}
          />
        </div>
      </div>
    </div>
  );
}
