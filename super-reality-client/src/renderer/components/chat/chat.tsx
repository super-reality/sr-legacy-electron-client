import React from "react";
import { useDispatch } from "react-redux";
import client, { logoutChat } from "./feathers";
import ButtonSimple from "../button-simple";
import MembersList from "./members-list";
import TextChat from "./text-chat";
import reduxAction from "../../redux/reduxAction";

interface ChatProps {
  users: any[];
  messages: any[];
}

export default function Chat(props: ChatProps) {
  const { users, messages } = props;
  const dispatch = useDispatch();

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

  const logout = () => {
    logoutChat();
    console.log("logout");
    reduxAction(dispatch, { type: "LOGIN_CHAT_ERROR", arg: null });
    reduxAction(dispatch, { type: "SET_MESSAGES", arg: [] });
    reduxAction(dispatch, { type: "SET_USERS", arg: [] });
  };
  // const scrollToBottom = () => {
  //   const chat = document.querySelector(".chat");
  //   if (chat) {
  //     chat.scrollTop = chat.scrollHeight - chat.clientHeight;
  //   }
  // };

  // useEffect(() => {
  //   client.service("messages").on("created", scrollToBottom);
  //   scrollToBottom();
  //   client.service("messages").removeListener("created", scrollToBottom);
  // }, []);
  const removeChatAccount = () => {
    const username = window.localStorage.getItem("username");
    try {
      client.service("users").remove({ email: username });
    } catch (err) {
      console.log("remove user error", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <ButtonSimple style={{ margin: "10px" }} onClick={logout}>
          Logout
        </ButtonSimple>
        <ButtonSimple
          style={{
            color: "red",
            margin: "10px",
          }}
          onClick={() => {
            removeChatAccount();
          }}
        >
          Remove Chat Account
        </ButtonSimple>
      </div>
      {users && <MembersList users={users} />}
      {messages && <TextChat sendMessage={sendMessage} messages={messages} />}
    </div>
  );
}

/*
<ul className="flex flex-column flex-1 list-unstyled user-list">
                {users &&
                  users.map((user) => (
                    <li key={user._id}>
                      <a className="block relative" href="#">
                        <img
                          src={user.avatar}
                          alt={user.email}
                          className="avatar"
                        />
                        <span className="absolute username">{user.email}</span>
                      </a>
                    </li>
                  ))}
              </ul>
              
      {users && messages ? (
        <main
          className="flex flex-column"
          style={{
            overflow: "auto",
          }}
        >
          <header className="title-bar flex flex-row flex-center">
            <div className="title-wrapper block center-element">
              <span className="title">Chat</span>
            </div>
          </header>

          <div className="flex flex-row flex-1 clear">
            <aside className="sidebar col col-3 flex flex-column flex-space-between">
              <header className="flex flex-row flex-center">
                <h4 className="font-300 text-center">
                  <span className="font-600 online-count">
                    {users ? users.length : 0}
                  </span>{" "}
                  users
                </h4>
              </header>
              {users && <MembersList users={users} />}

              <footer className="flex flex-row flex-center">
                <a
                  href="#"
                  onClick={() => logout()}
                  className="button button-primary"
                >
                  Sign Out
                </a>
              </footer>
            </aside>

            <div
              className="flex flex-column col col-9 chat"
              style={{
                height: "50px",
              }}
            >
              <main className="chat flex flex-column flex-1 clear">
                
              </main>

              <input
                value={text}
                type="text"
                onChange={(e) => {
                  handleOnChange(e);
                }}
                name="text"
                className="flex flex-1"
              />
              <ButtonSimple
                onClick={sendMessage}
                className="flex flex-row flex-space-between"
                id="send-message"
              >
                Send
              </ButtonSimple>
            </div>
          </div>
        </main>
      ) : (
        <div>Loading...</div>
      )}
*/
