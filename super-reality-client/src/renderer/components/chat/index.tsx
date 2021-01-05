import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./login-chat";
import { AppState } from "../../redux/stores/renderer";
import DefaultIcon from "../../../assets/images/default-chat-icon.png";
// import Sonic from "../../../assets/images/sonic.png";
// import Nick from "../../../assets/images/Nick.png";
// import Pacman from "../../../assets/images/pacman.png";
import { ReactComponent as SendButton } from "../../../assets/svg/send.svg";
import "./index.scss";
import client from "./feathers";
import reduxAction from "../../redux/reduxAction";

interface ChatProps {
  users: any[];
  messages: any[];
}

export function Chat(props: ChatProps) {
  const { users, messages } = props;
  const [textMessage, setTextMessage] = useState("");
  // const { user }: any = useSelector((state: AppState) => state.chat.loginData);
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

  const onTextChange = (e: any) => {
    const message = e.target.value;
    setTextMessage(message);
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
  const messageTime = (unixTimestam: number) => {
    const milliseconds = unixTimestam * 1000; // 1575909015000

    const dateObject = new Date(milliseconds);

    const humanDateFormat = dateObject.toLocaleString();
    console.log("date converted:", humanDateFormat);
    return humanDateFormat;
  };
  console.log(Chat);
  const dispatch = useDispatch();
  // chat functions
  // const { messages, users } = useSelector((state: AppState) => state.chat);
  const logoutListener = () => {
    console.log("logout");
    reduxAction(dispatch, { type: "LOGIN_CHAT_ERROR", arg: null });
    reduxAction(dispatch, { type: "SET_MESSAGES", arg: [] });
    reduxAction(dispatch, { type: "SET_USERS", arg: [] });
  };
  // message created listener
  const onMessageCreatedListener = (newMessage: any, stateMessages: any[]) => {
    console.log(
      "message created",
      newMessage,
      "messages",
      stateMessages,
      messages
    );
    const newMessages = [...stateMessages, newMessage];
    reduxAction(dispatch, { type: "SET_MESSAGES", arg: newMessages });
  };
  // chat listener
  useEffect(() => {
    // (client as any)
    //   .authenticate()
    //   .then((res: any) => {
    //     console.log("whohooo chat reAuth login", res);
    //     // reduxAction(dispatch, { type: "LOGIN_CHAT_SUCCES", arg: null });
    //   })
    //   .catch((err: any) => {
    //     console.log("chat jwt login error", err);
    //     (client as any).logout();
    //     // reduxAction(dispatch, { type: "LOGIN_CHAT_ERROR", arg: null });
    //   });
    // client
    //   .service("messages")
    //   .find()
    //   .then((res: any) => {
    //     console.log("test get messages res:", res);
    //   })
    //   .catch((err: any) => {
    //     console.log("test get messages err:", err);
    //   });
    const messagesClient = client.service("messages");
    const usersClient = client.service("users");
    Promise.all([
      messagesClient.find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25,
        },
      }),
      usersClient.find(),
    ])
      .then(([messagePage, userPage]) => {
        // We want the latest messages but in the reversed order
        const uploadedMessages = messagePage.data.reverse();
        const uploadedUsers = userPage.data;
        console.log(
          "first time",
          "messages",
          uploadedMessages,
          "users",
          uploadedUsers
        );
        // Once both return, update the state
        // reduxAction(dispatch, { type: "SET_CHAT_LOGIN_DATA", arg: login });
        reduxAction(dispatch, {
          type: "SET_MESSAGES",
          arg: [...uploadedMessages],
        });
        reduxAction(dispatch, { type: "SET_USERS", arg: [...uploadedUsers] });
        // Add new messages to the message list

        client.service("messages").on("created", (message: any) => {
          onMessageCreatedListener(message, messages);
        });
      })
      .catch((err) => {
        console.log("on authenticated", err);
      });
    // On successfull login
    console.log("authenticated listener");
    client.on("authenticated", (login) => {
      // Get all users and messages
      console.log("authenticated listener start. login:", login);
      Promise.all([
        messagesClient.find({
          query: {
            $sort: { createdAt: -1 },
            $limit: 25,
          },
        }),
        usersClient.find(),
      ])
        .then(([messagePage, userPage]) => {
          // We want the latest messages but in the reversed order
          const uploadedMessages = messagePage.data.reverse();
          const uploadedUsers = userPage.data;
          console.log(
            "login",
            login,
            "messages",
            uploadedMessages,
            "users",
            uploadedUsers
          );
          // Once both return, update the state
          reduxAction(dispatch, { type: "SET_CHAT_LOGIN_DATA", arg: login });
          reduxAction(dispatch, {
            type: "SET_MESSAGES",
            arg: uploadedMessages,
          });
          reduxAction(dispatch, { type: "SET_USERS", arg: uploadedUsers });
        })
        .catch((err) => {
          console.log("on authenticated", err);
        });
    });

    //

    // Add new users to the user list
    usersClient.on("created", (user: any) => {
      const updatedUsers = users.concat(user);
      reduxAction(dispatch, { type: "SET_USERS", arg: updatedUsers });
    });

    // client.service("messages").on("created", (message: any) => {
    //   console.log("message created", message, "messages", messages);
    //   const newMessages = [...messages, message];
    //   reduxAction(dispatch, { type: "SET_MESSAGES", arg: newMessages });
    // });

    client.on("logout", () => {
      console.log("logout");
      logoutListener();
    });
  }, []);
  return (
    <>
      <div className="title">Chat</div>
      <div className="chat-container">
        <div className="chats">
          {messages.map((messageObject) => {
            const { _id, user, createdAt, text } = messageObject;
            return (
              <div className="single-chat" key={_id}>
                <img className="avatar" src={DefaultIcon} alt="sonic" />
                <div className="info">
                  <div className="user">{user.email}</div>
                  <div className="timestamp">{messageTime(createdAt)}</div>
                </div>
                <div className="message">{text}</div>
              </div>
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
    </>
  );
}

export default function ChatApplication() {
  const { isChatAuth, messages, users } = useSelector(
    (state: AppState) => state.chat
  );

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
        <Chat messages={messages} users={users} />
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
