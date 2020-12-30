import React, { useState } from "react";
import "./index.scss";
import BaseTextArea from "../../base-textarea";
import ButtonSimple from "../../button-simple";
// import client from "../feathers";

interface TextChatProps {
  sendMessage: (text: string) => void;
  messages: any[];
}

export default function TextChat(props: TextChatProps): JSX.Element {
  const { sendMessage, messages } = props;
  const [text, setText] = useState("");

  const onTextChange = (e: any) => {
    const message = e.target.value;
    setText(message);
  };

  const createMessage = (messageContent: string) => {
    sendMessage(messageContent);
    setText("");
  };
  console.log("messages", messages);
  //   const scrollToBottom = () => {
  //     const chat = (document as any).querySelector(".messages");

  //     chat.scrollTop = chat.scrollHeight - chat.clientHeight;
  //     console.log("chat.scrollTop", chat.scrollTop);
  //   };
  //   useEffect(() => {
  //     client.service("messages").on("created", scrollToBottom);
  //     client.service("messages").removeListener("created", scrollToBottom);
  //   }, []);
  return (
    <div className="chat-container">
      <div
        className="messages"
        style={{
          height: `${
            (document as any).querySelector(".window-content-container")
              .clientHeight - 105
          }px`,
          overflow: "auto",
        }}
      >
        {messages.map((message) => {
          return (
            <div className="messages-message" key={message._id}>
              <div
                className="chat-user"
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <img
                  src={message.user.avatar}
                  alt={message.user.email}
                  className="avatar"
                />
                <div
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {message.user.email}
                </div>
              </div>

              <div className="message-text">{message.text}</div>
            </div>
          );
        })}
      </div>
      <BaseTextArea
        title="type text here"
        value={text}
        onChange={onTextChange}
      />
      <ButtonSimple
        onClick={() => {
          createMessage(text);
        }}
      >
        Send Message
      </ButtonSimple>
    </div>
  );
}
