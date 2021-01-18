import "./index.scss";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/stores/renderer";

import Channels from "../channels";
import Chat from "../chat";
import Login from "../chat/login-chat";
import GroupsPage from "../groups";

import Sonic from "../../../assets/images/sonic.png";

export default function Browser() {
  const { isChatAuth, messages, users, activeGroup } = useSelector(
    (state: AppState) => state.chat
  );
  const [showGroups, setShowGroups] = useState(false);

  return (
    <div>
      <div className="browser-nav">
        <div className="group-button">
          <div
            className="single-button"
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setShowGroups(!showGroups);
            }}
          >
            <img src={Sonic} alt="" />
            <div className="group-title">
              {showGroups ? "Show Chat" : "Show Groups"}
            </div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
        <div className="group-button">
          <div className="single-button">
            <img src={Sonic} alt="" />
            <div className="group-title">YO!!!!</div>
          </div>
        </div>
      </div>
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
          />
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
