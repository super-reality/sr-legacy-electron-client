import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
/* eslint-disable-next-line */
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

interface ChatProps {
  users: any[];
  messages: any[];
}

interface MessageProps {
  messageProp: any;
}

export function Message(props: MessageProps) {
  const { messageProp } = props;
  const { _id, user, createdAt, text } = messageProp;

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [textEdit, setTextEdit] = useState("");
  const [edit, setEdit] = useState<boolean>(false);

  const openMessageMenu = () => {
    setOpenMenu(true);
  };

  const closeMessageMenu = () => {
    setOpenMenu(false);
  };
  const onTextChange = (e: any) => {
    const message = e.target.value;
    setTextEdit(message);
  };

  const messageTime = (unixTimestam: number) => {
    // const milliseconds = unixTimestam * 1000; // 1575909015000

    // const dateObject = new Date(milliseconds);
    const dateObject = moment(unixTimestam).calendar();

    // const humanDateFormat = dateObject.toLocaleString();
    console.log("date converted:", dateObject);

    return dateObject;
  };

  // delete message function
  const removeMessage = (id: string) => {
    (client as any).service("messages").remove(id);
  };

  // edit message
  const startEditMessage = (oldMessage: string) => {
    setTextEdit(oldMessage);
    setEdit(true);
  };

  // patch updated message
  const submitEditMessage = (id: string, updatedMessage: string) => {
    (client as any).service("messages").patch(id, {
      text: updatedMessage,
    });
    setEdit(false);
    setTextEdit("");
    setOpenMenu(false);
  };

  const handleEnterDownEdit = (
    id: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      submitEditMessage(id, textEdit);
      setTextEdit("");
      setOpenMenu(false);
    }
  };
  const cancelEditingMessage = () => {
    setEdit(false);
    setTextEdit("");
    setOpenMenu(false);
  };
  return (
    <div className="single-chat" key={_id}>
      <img className="avatar" src={DefaultIcon} alt="sonic" />
      <div className="info">
        <div className="user">{user.email}</div>
        <div className="timestamp">{messageTime(createdAt)}</div>
      </div>
      {!edit ? (
        <div className="message-box">
          <div className="message">{text}</div>
          {openMenu ? (
            <ul>
              <li>
                <button
                  type="button"
                  style={{
                    cursor: "pointer",
                    color: "var(--color-text)",
                  }}
                  onClick={() => {
                    removeMessage(_id);
                  }}
                >
                  del
                </button>
              </li>
              <li>
                <button
                  type="button"
                  style={{
                    cursor: "pointer",
                    color: "var(--color-text)",
                  }}
                  onClick={() => {
                    startEditMessage(text);
                  }}
                >
                  edit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  style={{
                    cursor: "pointer",
                    color: "var(--color-text)",
                  }}
                  onClick={() => {
                    closeMessageMenu();
                  }}
                >
                  close menu
                </button>
              </li>
            </ul>
          ) : (
            <button
              type="button"
              style={{
                cursor: "pointer",
                color: "var(--color-text)",
              }}
              onClick={() => {
                openMessageMenu();
              }}
            >
              ...
            </button>
          )}
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          {messages.map((messageObject) => {
            return (
              <Message key={messageObject._id} messageProp={messageObject} />
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
