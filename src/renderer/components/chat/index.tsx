import { useCallback, useEffect, useRef, useState } from "react";
/* eslint-disable-next-line */
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { uniqueId } from "lodash";
import axios from "axios";
import DefaultIcon from "../../../assets/images/default-chat-icon.png";
// import Sonic from "../../../assets/images/sonic.png";
// import Nick from "../../../assets/images/Nick.png";
// import Pacman from "../../../assets/images/pacman.png";
import { ReactComponent as SendButton } from "../../../assets/svg/send.svg";
import "./index.scss";
import client from "../../feathers";
import useDetectOutsideClick from "../../hooks/useDetectOutsideClick";
import { Channel, ChatUser, Message } from "../../../types/chat";
import IconEdit from "../../../assets/images/popup-edit.png";
import IconDelete from "../../../assets/images/popup-delete.png";
// import { getMessages } from "../../../utils/chat-utils/message-services";
import reduxAction from "../../redux/reduxAction";
import {
  slashRegEx,
  scriptRegEx,
  createHelpString,
  scriptsList,
} from "../ai-chat/ai-utils/ai-general-utils";
import { CollectiveAI } from "../../api/types/collective-ai/create-collective-ai";
import { AppState } from "../../redux/stores/renderer";

const createUserDate = new Date("May 17, 2021 03:24:00");
const updateUserDate = new Date("May 17, 2021 04:24:00");
const chatUser = {
  _id: "test user",
  username: "test user",
  firstname: "test",
  lastname: "testuser",
  // avatar?: string,
  createdAt: createUserDate.toUTCString(),
  updatedAt: updateUserDate.toUTCString(),
};
const createAiUser = (id: string, userName: string) => {
  return {
    _id: id,
    username: userName,
    firstname: "AI",
    lastname: "AI",
    // avatar?: string,
    createdAt: createUserDate.toUTCString(),
    updatedAt: updateUserDate.toUTCString(),
  };
};

interface ChatProps {
  messages: Message[];
  activeChannel?: Channel;
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
  user?: User;
  createdAt?: string;
  text: string;
}

interface MessageDropdownProps {
  removeMessage: () => void;
  startEditMessage: () => void;
  closeFunction: () => void;
}

type Steps = "zero" | "first" | "second" | "final";

function MessageDropdouwn(props: MessageDropdownProps) {
  const { removeMessage, startEditMessage, closeFunction } = props;

  const dotsRef = useRef<HTMLDivElement>(null);

  useDetectOutsideClick(dotsRef, closeFunction);

  const deleteMessage = () => {
    removeMessage();
    closeFunction();
  };

  const editMessage = () => {
    startEditMessage();
    closeFunction();
  };
  return (
    <div ref={dotsRef} className="message-dropdown">
      <div className="dropdown-item" onClick={editMessage}>
        <div>
          Edit Message
          <img src={IconEdit} alt="" />
        </div>
      </div>
      <div className="dropdown-item" onClick={deleteMessage}>
        <div>
          Delete Message
          <img src={IconDelete} alt="" />
        </div>
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
    (client as any)
      .service("messages")
      .remove(_id)
      .catch((err: any) => {
        console.log(err);
      });
  };

  // edit message
  const startEditMessage = () => {
    setTextEdit(text);
    setEdit(true);
  };

  // patch updated message
  const submitEditMessage = (id: string, updatedMessage: string) => {
    (client as any)
      .service("messages")
      .patch(id, {
        text: updatedMessage,
      })
      .catch((err: any) => {
        console.log(err);
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
    <div
      className={`single-chat ${isHover ? "hovered" : ""} ${
        createdAt ? "" : "no-time-message"
      }`}
      key={uniqueId()}
    >
      {user && (
        <>
          <img
            className="avatar"
            src={user.avatar || DefaultIcon}
            alt="avatar"
          />
          <div className="info">
            <div className="user">{user.username}</div>
            <div className="timestamp">
              {createdAt && messageTime(createdAt)}
            </div>
          </div>
        </>
      )}

      {!edit ? (
        <div
          className="message-box"
          onMouseEnter={showMessageMenu}
          onMouseLeave={hideMessageMenu}
        >
          <div className="message">{text}</div>
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
  const { activeChannel, messages } = props;
  const [textMessage, setTextMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  console.log("activeChannel", activeChannel);

  const [addService, setAddService] = useState("default");
  const [steps, setSteps] = useState<Steps>("zero");

  const newCollectiveProps = useSelector(
    (state: AppState) => state.createCollectiveAI
  );

  // useEffect(() => {
  //   getMessages(activeChannel._id)
  //     .then((res: any) => {
  //       console.log("messageResult", res);
  //       // We want the latest messages but in the reversed order
  //       const uploadedMessages = res.data.reverse();
  //       console.log("messages", uploadedMessages);
  //       reduxAction(dispatch, {
  //         type: "SET_MESSAGES",
  //         arg: uploadedMessages,
  //       });
  //     })
  //     .catch((err: any) => {
  //       console.log(err);
  //     });
  // }, [activeChannel]);

  const onTextChange = (e: any) => {
    const message = e.target.value;
    setTextMessage(message);
  };
  const askAI = useCallback((text: string) => {
    // axios
    //   .post(
    //     "http://54.215.246.31/api/ask-question/?format=json",
    //     {
    //       id: "1",
    //       question: text,
    //     },
    //     {
    //       headers: {
    //         Authorization: "Token 373ad9da222bb13da11a37f9b212375207bb304c",
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     const answer = res.data;
    //     const date = new Date();
    //     console.log("ai answer", answer[1]);
    //     const messageAI = {
    //       _id: uniqueId(),
    //       channelId: "1",
    //       text: answer[1],
    //       userId: "AI",
    //       createdAt: date.toUTCString(),
    //       user: aiUser,
    //     };
    //     reduxAction(dispatch, {
    //       type: "ADD_MESSAGE",
    //       arg: messageAI,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log("question error", err);
    //   });
  }, []);
  const createAiMessage = (text: string) => {
    const date = new Date();
    const messageAI = {
      _id: uniqueId(),
      channelId: "1",
      text,
      userId: "AI",
      createdAt: date.toUTCString(),
      user: createAiUser("AI", "AI"),
    };
    return messageAI;
  };
  const createCollectiveAIService = useCallback(() => {
    axios
      .post(
        "http://54.215.246.31/api/collective/",
        {
          collective_name: newCollectiveProps.name,
        },
        {
          headers: {
            Authorization: "Token 373ad9da222bb13da11a37f9b212375207bb304c",
          },
        }
      )
      .then((res) => {
        const collectiveName = res.data.collective_name;

        console.log("ai answer", res.data);
        const messageAI = createAiMessage(
          `Collective AI ${collectiveName} has not been created`
        );
        reduxAction(dispatch, {
          type: "ADD_MESSAGE",
          arg: messageAI,
        });
      })
      .catch((err) => {
        console.log("question error", err);
        const messageAI = createAiMessage(
          `Something wrong ${newCollectiveProps.name} has been created`
        );
        reduxAction(dispatch, {
          type: "ADD_MESSAGE",
          arg: messageAI,
        });
      });
  }, []);

  const createAiBotSteps = (step: Steps) => {
    switch (step) {
      case "final":
        createCollectiveAIService();
        setSteps("zero");
        break;
      default:
        setAddService(addService);
    }
  };
  const addCollectiveAIDataToForm = (formProps: Partial<CollectiveAI>) => {
    reduxAction(dispatch, {
      type: "SET_AI_COLLECTIVE_DATA",
      arg: { ...formProps },
    });
  };
  // assign variable for dispatch for create AI and subbort ticket
  interface InputService {
    [param: string]: (t: any) => void;
  }
  const inputService: InputService = {
    default: (text: any) => {
      const message = text;
    },
    addName: (name: string) => {
      addCollectiveAIDataToForm({ name });
    },
  };
  // const addName = (name: string) => {
  //   addCollectiveAIDataToForm({ name });
  // };
  const aiBot = (text: string) => {
    const scriptArray = text.match(scriptRegEx);
    console.log("detectAIScript", scriptArray);

    if (scriptArray !== null) {
      const script = scriptArray[0];
      switch (script) {
        case "/create ai":
          setAddService("addName");
          console.log(addService);
          return "What are you going to call it?";
        default:
          return `Sorry I didn't get your command.\nUse this commands:\n${createHelpString(
            scriptsList
          )}`;
      }
    }
    return `Sorry I didn't get your command.\nUse this commands:\n${createHelpString(
      scriptsList
    )}`;
  };

  const createBotMessage = (text: string, user: ChatUser) => {
    const createdAt = new Date();
    const message = {
      _id: uniqueId(),
      channelId: "channelId",
      text,
      userId: "userId",
      createdAt: createdAt.toUTCString(),
      user,
    };
    return message;
  };
  const sendMessage = useCallback((text: string) => {
    const message = createBotMessage(text, chatUser);
    reduxAction(dispatch, {
      type: "ADD_MESSAGE",
      arg: message,
    });
    if (text !== "") {
      if (slashRegEx.test(text)) {
        console.log("detected command from chat");
        const botAnswer = aiBot(text);
        const botMessage = createBotMessage(
          botAnswer,
          createAiUser("AI", "AI")
        );
        console.log("botAnswer", botAnswer);
        reduxAction(dispatch, {
          type: "ADD_MESSAGE",
          arg: botMessage,
        });
      }

      // client
      //   .service("messages")
      //   .create({ channelId: activeChannel._id, text })
      //   .catch((err: any) => {
      //     console.log("create message error", err);
      //   });
    }
  }, []);

  // testing the Taimoors API
  // useEffect(() => {
  //   axios
  //     .get("http://54.215.246.31/api/collective", {
  //       headers: {
  //         Authorization: "Token 373ad9da222bb13da11a37f9b212375207bb304c",
  //       },
  //     })
  //     .then((res) => {
  //       const answer = res.data;

  //       console.log("ai collectives", answer);
  //     })
  //     .catch((err) => {
  //       console.log("question error", err);
  //     });
  // }, []);

  const createMessage = (messageContent: string) => {
    const serviceFunc = inputService[addService];
    sendMessage(messageContent);
    serviceFunc(messageContent);
    console.log("inputService check", serviceFunc);
    console.log("addService check", addService);
    setTextMessage("");
  };
  const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createMessage(textMessage);
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

  const checkMessageTime = (currentTime: string, prevTime: string) => {
    const timeDifference =
      moment(currentTime).hours() * 60 +
      moment(currentTime).minutes() -
      moment(prevTime).hours() * 60 -
      moment(prevTime).minutes();
    return timeDifference < 10;
  };

  return (
    <div className="chat-with-title-container">
      <div className="chat-and-channels-title">activeChannel.channelName</div>
      <div className="chat-container">
        <div className="chats" ref={messagesEndRef}>
          {messages &&
            messages.map((messageObject: Message, index) => {
              const { _id, user, createdAt, text, userId } = messageObject;
              const prevMessage = messages[index - 1];

              if (
                index !== 0 &&
                prevMessage.userId == userId &&
                checkMessageTime(createdAt, prevMessage.createdAt)
              ) {
                return <MessageBox key={_id} _id={_id} text={text} />;
              }

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
