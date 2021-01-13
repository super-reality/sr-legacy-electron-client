import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Login from "./login-chat";
import { AppState } from "../../redux/stores/renderer";
import DefaultIcon from "../../../assets/images/default-chat-icon.png";
// import Sonic from "../../../assets/images/sonic.png";
// import Nick from "../../../assets/images/Nick.png";
// import Pacman from "../../../assets/images/pacman.png";
import { ReactComponent as SendButton } from "../../../assets/svg/send.svg";
import "./index.scss";
import Channels from "../channels";
import client from "../../feathers";
import usePopupMessageMenu from "../../hooks/usePopupMessageMenu";

interface ChatProps {
  users: any[];
  messages: any[];
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

export function Message(props: MessageProps) {
  const { _id, user, createdAt, text } = props;

  const [isHover, setIsHover] = useState<boolean>(false);
  const [textEdit, setTextEdit] = useState("");
  const [edit, setEdit] = useState<boolean>(false);
  const dotsRef = useRef<HTMLDivElement>(null);

  const showMessageMenu = () => {
    setIsHover(true);
  };

  const hideMessageMenu = () => {
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

  const yPosition = dotsRef.current?.offsetTop;
  const xPosition = dotsRef.current?.offsetLeft;
  // Popup menu
  const [PopupMenu, openMessagePopup] = usePopupMessageMenu({
    removeMessage,
    startEditMessage,
    yPosition,
    xPosition,
  });
  console.log(user.avatar);
  return (
    <div className="single-chat" key={_id}>
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
          <PopupMenu />
          {isHover ? (
            <button
              type="button"
              className="dots-menu"
              onClick={openMessagePopup}
            >
              ...
            </button>
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
            cancel
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
            save
          </button>
        </div>
      )}
    </div>
  );
}

export function Chat(props: ChatProps) {
  const { users, messages } = props;
  const [textMessage, setTextMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onTextChange = (e: any) => {
    const message = e.target.value;
    setTextMessage(message);
  };

  console.log("users:", users, "messages", messages);
  // const dispatch = useDispatch();

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
      <div className="title">Chat</div>
      <div className="chat-container">
        <div className="chats" ref={messagesEndRef}>
          {messages.map((messageObject: any) => {
            const { _id, user, createdAt, text } = messageObject;
            return (
              <Message
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

export default function ChatApplication() {
  const { isChatAuth, messages, users } = useSelector(
    (state: AppState) => state.chat
  );

  // useEffect(() => {
  //   const getChannels = async () => {
  //     const channelResult = await client.service("channel").find({
  //       query: {
  //         $limit: 10,
  //         $skip: 0,
  //       },
  //     });
  //     console.log(channelResult);
  //   };
  //   getChannels();
  // }, []);
  // useEffect(() => {
  //   const messagesClient = client.service("messages");
  //   const usersClient = client.service("users");

  //   // Try to authenticate with the JWT stored in localStorage
  //   // client.authenticate().catch((err) => {
  //   //   const token = localStorage.getItem("token");
  //   //   console.log("token", token, "err authent", err);

  //   //   setChatState({ login: null });
  //   // });

  //   // On logout reset all all local state (which will then show the login screen)
  // }, []);

  return (
    <div>
      {!isChatAuth ? (
        <main className="container text-center">
          <Login />
        </main>
      ) : (
        <div className="chat-and-channels-container">
          <Channels />
          <Chat messages={messages} users={users} />
        </div>
      )}
    </div>
  );
}

/*
<div className="title">Chat</div>
      <div className="chat-container">
        <div className="chats">
          <div className="single-chat">
            <img className="avatar" src={Sonic} alt="sonic" />
            <div className="info">
              <div className="user">Sonic</div>
              <div className="timestamp">Dec 22,2020</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>

          <div className="single-chat">
            <img className="avatar" src={Nick} alt="Nick Mark" />
            <div className="info">
              <div className="user">Nick Marks</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">Thank you so much!</div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
        </div>
        <div className="chat-input">
          <input type="text" placeholder="You rock!" />
          <SendButton />
        </div>
      </div>
*/
