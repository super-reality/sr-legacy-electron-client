import "./index.scss";
import React, { useState } from "react";
import { useSpring, animated, config } from "react-spring";
import { useSelector } from "react-redux";
import ButtonAdd from "../../../assets/images/add-circle.png";

import PacMan from "../../../assets/images/pacman.png";
import Sonic from "../../../assets/images/sonic.png";
import DefaultUser from "../../../assets/images/default-chat-icon.png";
import TeacherBot from "../../../assets/svg/teacher-bot.svg";
import { ReactComponent as Support } from "../../../assets/svg/support.svg";
import { Channel, ChatUser, Group } from "../../../types/chat";
import { PagesIndex } from "../../../types/browser";
import { AppState } from "../../redux/stores/renderer";
import { channelsClient } from "../../../utils/chat-utils/services";

interface ChannelsProps {
  activeGroup: Group;
  setPage: (pageIndex: any) => void;
}

interface SingleChannelProps {
  channel: Channel;
  selfId: string;
  chatUsers: ChatUser[];
}

export function SingleChannel(props: SingleChannelProps): JSX.Element {
  const { channel, selfId, chatUsers } = props;
  console.log(channel, selfId, chatUsers);
  const { users } = channel;
  const singleUser = users.filter((_id) => _id !== selfId);
  const interlocutor = chatUsers.find(({ _id }) => _id === singleUser[0]);
  console.log("singleUser", singleUser, "interlocutor", interlocutor);

  return (
    <div className="single-channel">
      <img className="avatar" src={DefaultUser} alt="" />
      <div className="info">{channel.channelName}</div>
    </div>
  );
}

export default function Channels(props: ChannelsProps): JSX.Element {
  const { activeGroup, setPage } = props;
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
          <ul>
            <li onClick={() => setPage(PagesIndex.groupSettings)}>
              Group settings
            </li>
            <li>Invite People</li>
            <li>Create Channel</li>
            <li>Create Category</li>
            <li>Some settings</li>
            <li>Some settings</li>
          </ul>
        </div>
      </animated.div>

      <div className="channel-title">Super Powers</div>
      <div className="add">
        <button
          type="button"
          onClick={() => {
            channelsClient
              .patch("600b196bf194e54665e59285", {
                channelName: "update test channel denis",
              })
              .catch((err: any) => {
                console.log(err);
              });
          }}
        >
          <img src={ButtonAdd} />
        </button>
      </div>
      <div className="channel-container">
        <div className="channels">
          <div className="single-channel">
            {/* <img className="avatar" src={Support} alt="" /> */}
            <Support />
            <div className="info">Support</div>
          </div>
          <div className="single-channel">
            <img className="avatar" src={TeacherBot} alt="" />
            <div className="info">Teacher Bot</div>
          </div>
        </div>
      </div>
      <div className="channel-title">Rooms</div>
      <div className="add">
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
