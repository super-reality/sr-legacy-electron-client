import "./index.scss";
import React, { useState } from "react";
import { useSpring, animated, config } from "react-spring";
import { useDispatch, useSelector } from "react-redux";
import ButtonAdd from "../../../assets/images/add-circle.png";
import PacMan from "../../../assets/images/pacman.png";
import Sonic from "../../../assets/images/sonic.png";
import DefaultUser from "../../../assets/images/default-chat-icon.png";
import TeacherBot from "../../../assets/images/teacher-bot.png";
import Support from "../../../assets/images/support.png";
import { Channel, ChatUser, Group } from "../../../types/chat";
import { PagesIndex } from "../../../types/browser";
import { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";
import { updateChannel } from "../../../utils/chat-utils/services";

interface ChannelsProps {
  activeGroup: Group;
  setPage: (pageIndex: any) => void;
  createChannel: () => void;
}

interface SingleChannelProps {
  channel: Channel;
  selfId: string;
  chatUsers: ChatUser[];
}

export function SingleChannel(props: SingleChannelProps): JSX.Element {
  const { channel, selfId, chatUsers } = props;
  const [showButton, setShowButton] = useState<boolean>(false);
  const dispatch = useDispatch();

  console.log(channel, selfId, chatUsers);
  // const { users } = channel;
  // const singleUser = users.filter((_id) => _id !== selfId);
  // const interlocutor = chatUsers.find(({ _id }) => _id === singleUser[0]);
  // console.log("singleUser", singleUser, "interlocutor", interlocutor);

  const setActiveChannel = (activeChannel: Channel) => {
    reduxAction(dispatch, {
      type: "SET_ACTIVE_CHANNEL",
      arg: activeChannel,
    });
  };

  return (
    <div
      className="single-channel"
      onClick={() => {
        setActiveChannel(channel);
      }}
      onMouseEnter={() => {
        setShowButton(true);
      }}
      onMouseLeave={() => {
        setShowButton(false);
      }}
    >
      <img className="avatar" src={DefaultUser} alt="" />
      <div className="info">{channel.channelName}</div>
      {showButton && (
        <div
          style={{
            backgroundColor: "var(--color-button-hover)",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            position: "absolute",
            left: "80%",
          }}
          onClick={() => {
            updateChannel(channel._id, {
              users: chatUsers,
            });
          }}
        />
      )}
    </div>
  );
}

export default function Channels(props: ChannelsProps): JSX.Element {
  const { activeGroup, setPage, createChannel } = props;
  const { loginData, channels, users } = useSelector(
    (state: AppState) => state.chat
  );
  const { user } = loginData;
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const showGroupSettings = () => {
    setShowSettings(!showSettings);
  };

  const springProps = useSpring({
    config: { ...config.gentle },
    opacity: showSettings ? "1" : "0",
    transform: showSettings ? `translateY(0)` : `translateY(-50%)`,
    display: showSettings ? "flex" : "none",
  } as any);

  return (
    <div className="channel">
      <div className="channel-title active-group" onClick={showGroupSettings}>
        {activeGroup.collectiveName}
      </div>
      <animated.div style={{ ...springProps }}>
        <div className="group-settings-dropdown">
          <div
            className="dropdown-item"
            onClick={() => setPage(PagesIndex.groupSettings)}
          >
            Group settings
          </div>
          <div className="dropdown-item">Invite People</div>
          <div className="dropdown-item">Create Category</div>
          <div className="dropdown-item">Some settings</div>
          <div className="dropdown-item">Some settings</div>
        </div>
      </animated.div>

      <div className="channel-title">Super Powers</div>
      <div className="add">
        <button type="button">
          <img src={ButtonAdd} />
        </button>
      </div>
      <div className="channel-container">
        <div className="channels">
          <div className="single-channel">
            <img className="avatar" src={Support} alt="" />
            <div className="info">Support</div>
          </div>
          <div className="single-channel">
            <img className="avatar" src={TeacherBot} alt="" />
            <div className="info">Teacher Bot</div>
          </div>
        </div>
      </div>
      <div className="channel-title">Rooms</div>
      <div className="add" onClick={createChannel}>
        <button type="button">
          <img src={ButtonAdd} />
        </button>
      </div>
      <div className="channel-container">
        <div className="channels">
          {channels.data.map((channel: Channel) => {
            return (
              <SingleChannel
                key={channel._id}
                channel={channel}
                selfId={user._id}
                chatUsers={users}
              />
            );
          })}
          <div className="single-channel">
            <img className="avatar" src={PacMan} alt="" />
            <div className="info">Meeting Room A</div>
          </div>
          <div className="single-channel">
            <img className="avatar" src={Sonic} alt="" />
            <div className="info">Tutorial Creators</div>
          </div>
        </div>
      </div>
      <div className="channel-title">Mentors</div>
      <div className="add">
        <button type="button">
          <img src={ButtonAdd} />
        </button>
      </div>
      <div className="channel-container">
        <div className="channels">
          <div className="single-channel">
            <img className="avatar" src={PacMan} alt="" />
            <div className="info">Sonic</div>
          </div>
          <div className="single-channel">
            <img className="avatar" src={Sonic} alt="" />
            <div className="info">Pac-Girl</div>
          </div>
        </div>
      </div>
      <div className="channel-title">Game</div>
      <div className="add">
        <button type="button">
          <img src={ButtonAdd} />
        </button>
      </div>
      <div className="channel-container">
        <div className="channels">
          <div className="single-channel">
            <img className="avatar" src={PacMan} alt="" />
            <div className="info">Tutorials</div>
          </div>
          <div className="single-channel">
            <img className="avatar" src={Sonic} alt="" />
            <div className="info">Events</div>
          </div>
          <div className="single-channel">
            <img className="avatar" src={PacMan} alt="" />
            <div className="info">Missions</div>
          </div>
          <div className="single-channel">
            <img className="avatar" src={Sonic} alt="" />
            <div className="info">Quests</div>
          </div>
        </div>
      </div>
    </div>
  );
}
