import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/stores/renderer";
import Channels from "../channels";
import Chat from "../chat";
import Login from "../chat/login-chat";
import GroupsPage from "../groups";

export default function Browser() {
  const { isChatAuth, messages, users, activeGroup } = useSelector(
    (state: AppState) => state.chat
  );
  const [showGroups, setShowGroups] = useState(false);

  return (
    <div>
      {!isChatAuth ? (
        <main className="container text-center">
          <Login />
        </main>
      ) : (
        <div>
          <button
            type="button"
            style={{
              color: "var(--color-text)",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowGroups(!showGroups);
            }}
          >
            {showGroups ? "Show Chat" : "Show Groups"}
          </button>
          <div className="chat-and-channels-container">
            {showGroups ? (
              <GroupsPage />
            ) : (
              <>
                <Channels activeGroup={activeGroup} />
                <Chat messages={messages} users={users} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
