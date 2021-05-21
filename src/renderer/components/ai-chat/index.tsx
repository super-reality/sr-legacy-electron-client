import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppState } from "../../redux/stores/renderer";
import Chat from "../chat";

import Windowlet from "../windowlet";

import "./index.scss";

export default function MainChat() {
  const history = useHistory();
  const { messages } = useSelector((state: AppState) => state.chat);
  return (
    <Windowlet
      width={500}
      height={680}
      initialLeft="280"
      initialTop="110"
      title="Main AI Chat"
      //   onMinimize={minimizeWindow}
      onClose={() => history.push("/")}
    >
      <div className="chat-ai-main">
        <Chat messages={messages} />
      </div>
    </Windowlet>
  );
}
