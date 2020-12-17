import React, { useState } from "react";
import BaseTextArea from "../../../components/base-textarea";
import ButtonSimple from "../../../components/button-simple";
// import { Message } from "../../common/interfaces/Message";
// import client from "../../redux/feathers";

import { dMessages } from "../../views/chat/dummy-data";

interface TextChatProps {
  createMessage: (text: string) => void;
  activeChannel: any;
}

export default function TextChat(props: TextChatProps): JSX.Element {
  const { createMessage, activeChannel } = props;
  const [text, setText] = useState("");
  // const [messages, setMessages] = useState<Array<any>>(dMessages);

  const messages = dMessages;

  //   const getChannelMessages = async (channel = activeChannel) => {
  //     if (channel) {
  //       const messageResult = await client.service("message").find({
  //         query: {
  //           channelId: channel.id,
  //           $sort: {
  //             createdAt: -1,
  //           },
  //           // $limit: limit != null ? limit : getState().get('chat').get('channels').get('channels').get(channelId).limit,
  //           // $skip: skip != null ? skip : getState().get('chat').get('channels').get('channels').get(channelId).skip
  //         },
  //       });
  //       console.log("messageResult", messageResult);
  //       setMessages(messageResult.data);
  //     }
  //   };

  //   useEffect(() => {
  //     getChannelMessages(activeChannel);
  //   }, [activeChannel]);

  const onTextChange = (e: any) => {
    const message = e.target.value;
    setText(message);
  };
  console.log("activeChannel, chat-text", activeChannel);
  return (
    <div className="chat-container">
      <div className="messages">
        {activeChannel != null &&
          messages &&
          messages
            .sort(
              (a: any, b: any) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((message) => {
              return (
                <div className="messages-message" key={message.id}>
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
        style={{
          margin: "10px",
        }}
        onClick={() => {
          createMessage(text);
        }}
      >
        Send Message
      </ButtonSimple>
    </div>
  );
}
