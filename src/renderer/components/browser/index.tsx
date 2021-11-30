import "./index.scss";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/stores/renderer";

import Channels from "../channels";
import Chat from "../chat";
import GroupsPage from "../groups";

import Sonic from "../../../assets/images/sonic.png";
import GroupSettings from "../groups/group-settings";
import PagesIndex from "../../../types/browser";
import { createChannel } from "../../../utils/chat-utils/channels-services";
import usePopupCreateChannel from "../../hooks/usePopupCreateChatItem";
import { setSidebarWidth } from "../../../utils/setSidebarWidth";

interface ChatContainerProps {
  setPage: (pageIndex: any) => void;
}
function ChatContainer(props: ChatContainerProps) {
  const { setPage } = props;
  const {
    messages,
    activeGroup,
    activeChannel,
    channels,
    groups,
    categories,
  } = useSelector((state: AppState) => state.chat);
  const [categoryId, setCategoryId] = useState<string>("");

  const activeChannelObject = channels.data.find(
    ({ _id }) => _id === activeChannel
  );

  useEffect(() => {
    setSidebarWidth(700);
  }, []);

  const createCategoryChannel = (
    channelName: string,
    channelPhoto?: string
  ) => {
    if (categoryId !== "") {
      createChannel(categoryId, channelName, channelPhoto);
    }
  };

  const [CreateChannelPopup, openChannelCreatePopup] = usePopupCreateChannel({
    createItem: createCategoryChannel,
  });

  return (
    <>
      <CreateChannelPopup width="300px" height="200px" itemType="Channel" />
      <Channels
        activeGroup={activeGroup}
        channels={channels}
        groups={groups}
        categories={categories}
        setPage={setPage}
        createChannel={openChannelCreatePopup}
        setCategory={setCategoryId}
      />
      {activeChannelObject && (
        <Chat messages={messages} activeChannel={activeChannelObject} />
      )}
    </>
  );
}

export default function Browser() {
  const [showGroupsList, setShowGroupsList] = useState<boolean>(false);
  const [showGroups, setShowGroups] = useState(false);

  const pages = [ChatContainer, GroupSettings];
  const [browserContent, setBrowserContent] = useState<any>(
    PagesIndex.chatContainer
  );

  const setPage = (pageIndex: any) => {
    setBrowserContent(pageIndex);
  };
  const CurrentPage = pages[browserContent];

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
            <div key="show-groups">
              <div
                className="group-title"
                onClick={() => {
                  setShowGroups(!showGroups);
                }}
              >
                {showGroups ? "Show Chat" : "Explore the Groups"}
              </div>
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

      <div>
        <div className="chat-and-channels-container">
          {showGroups ? <GroupsPage /> : <CurrentPage setPage={setPage} />}
        </div>
      </div>
    </div>
  );
}
