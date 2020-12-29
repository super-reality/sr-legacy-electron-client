import React, { useState } from "react";
import moment from "moment";
import client, { logout } from "./feathers";
import ButtonSimple from "../button-simple";

interface ChatProps {
  users: any[];
  messages: any[];
}

export default function Chat(props: ChatProps) {
  const { users, messages } = props;
  const [text, setText] = useState("");

  const handleOnChange = (e: any) => {
    e.preventDefault();
    const messageText = e.target.value;
    setText(messageText);
  };
  const sendMessage = () => {
    if (text !== "") {
      console.log(text);
      client
        .service("messages")
        .create({ text })
        .then((res: any) => {
          console.log("create message res", res);
          setText("");
        });
    }
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

  return (
    <>
      {users && messages ? (
        <main
          className="flex flex-column"
          style={{
            overflow: "auto",
          }}
        >
          <header className="title-bar flex flex-row flex-center">
            <div className="title-wrapper block center-element">
              <img
                className="logo"
                src="http://feathersjs.com/img/feathers-logo-wide.png"
                alt="Feathers Logo"
              />
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
                {messages &&
                  messages.map((message) => (
                    <div key={message._id} className="message flex flex-row">
                      <img
                        src={message.user.avatar}
                        alt={message.user.email}
                        className="avatar"
                      />
                      <div className="message-wrapper">
                        <p className="message-header">
                          <span className="username font-600">
                            {message.user.email}
                          </span>
                          <span className="sent-date font-300">
                            {moment(message.createdAt).format(
                              "MMM Do, hh:mm:ss"
                            )}
                          </span>
                        </p>
                        <p className="message-content font-300">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  ))}
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
    </>
  );
}
