import "./index.scss";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated, config } from "react-spring";
import { AppState } from "../../redux/stores/renderer";

import Channels from "../channels";
import Chat from "../chat";
/* import Login from "../chat/login-chat"; */
import GroupsPage from "../groups";

import Sonic from "../../../assets/images/sonic.png";
import GroupSettings from "../groups/group-settings";
import PagesIndex from "../../../types/browser";
import reduxAction from "../../redux/reduxAction";
import { channelsClient } from "../../../utils/chat-utils/services";
// import { Group } from "../../../types/chat";
import usePopupCreateChannel from "../../hooks/usePopupCreateChatItem";

interface ChatContainerProps {
  setPage: (pageIndex: any) => void;
}
function ChatContainer(props: ChatContainerProps) {
  const { setPage } = props;
  const { activeChannel, activeGroup } = useSelector(
    (state: AppState) => state.chat
  );

  const createChannel = (channelName: string, channelPhoto?: string) => {
    let createProps;
    if (channelPhoto) {
      createProps = {
        channelName,
        channelPhoto,
      };
      console.log("channelProps", createProps);
    } else {
      createProps = {
        channelName,
      };
    }

    channelsClient.create(createProps).catch((err: any) => {
      console.log(err);
    });
  };
  const [CreateChannelPopup, openChannelCreatePopup] = usePopupCreateChannel({
    createItem: createChannel,
  });
  return (
    <>
      <CreateChannelPopup
        width="400px"
        height="200px"
        style={{
          right: "300px",
        }}
        itemType="Channel"
      />
      <Channels
        activeGroup={activeGroup}
        setPage={setPage}
        createChannel={openChannelCreatePopup}
      />
      <Chat messages={activeChannel.messages} />
    </>
  );
}

export default function Browser() {
  const { isChatAuth, groups } = useSelector((state: AppState) => state.chat);
  const dispatch = useDispatch();
  const [showGroupsList, setShowGroupsList] = useState<boolean>(false);
  const [showGroups, setShowGroups] = useState(false);

  const opacitySprings: any = showGroupsList ? "1" : "0";
  const zIndexSprings: any = showGroupsList ? "2" : "0";
  const springProps = useSpring({
    config: { ...config.gentle },
    transform: showGroupsList ? `translateY(0)` : `translateY(-100%)`,
    opacity: opacitySprings,
    zIndex: zIndexSprings,
    // height: showGroupsList ? height : "0px",
    width: "300px",
  });
  const pages = [ChatContainer, GroupSettings];
  const [browserContent, setBrowserContent] = useState<any>(
    PagesIndex.chatContainer
  );

  const setPage = (pageIndex: any) => {
    setBrowserContent(pageIndex);
  };
  const CurrentPage = pages[browserContent];

  const setActiveGroup = (id: string) => {
    reduxAction(dispatch, {
      type: "SET_ACTIVE_GROUP",
      arg: id,
    });
  };
  return (
    <div>
      <div className="browser-nav">
        <div className="group-button">
          <div
            className="single-button"
            onClick={() => {
              setShowGroupsList(!showGroupsList);
            }}
          >
            <img src={Sonic} alt="" />
            {/* <div className="groups-img">
              {groups &&
                groups.map((group: Group) => {
                  if (group.collectivePhoto) {
                    return <img src={group.collectivePhoto} alt="" />;
                  }
                  return null;
                })}
            </div> */}

            <animated.div
              style={{
                ...springProps,
                overflow: "hidden",
                position: "relative",
                width: "200px",
                zIndex: "2" as any,
                top: "157px",
              }}
            >
              <div className="menu-groups-list">
                <div key="show-groups">
                  <div
                    className="group-title"
                    onClick={() => {
                      setShowGroups(!showGroups);
                    }}
                  >
                    {showGroups ? "Show Chat" : "Show Groups"}
                  </div>
                </div>
                {groups.map((group) => {
                  return (
                    <div
                      className="menu-group-item"
                      key={group._id}
                      onClick={() => {
                        setActiveGroup(group._id);
                      }}
                    >
                      <img
                        src={group.collectivePhoto}
                        className="avatar"
                        alt=""
                      />
                      <div className="menu-list-group-name">
                        {group.collectiveName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </animated.div>
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
          {/* <Login /> */}
          <Channels activeGroup={activeGroup} />
        </main>
      ) : (
        <div>
          <div className="chat-and-channels-container">
            {showGroups ? <GroupsPage /> : <CurrentPage setPage={setPage} />}
          </div>
        </div>
      )}
    </div>
  );
}
