import "./index.scss";
import { useState } from "react";
import { useSpring, animated, config } from "react-spring";
import { Category, Group, ChannelsResult } from "../../../types/chat";
import { PagesIndex } from "../../../types/browser";
import {
  createCategory,
  updateCategory,
} from "../../../utils/chat-utils/categories-services";
import SingleCategory from "./category";

interface ChannelsProps {
  activeGroup: string;
  groups: Group[];
  categories: Category[];
  channels: ChannelsResult;
  setPage: (pageIndex: any) => void;
  createChannel: () => void;
  setCategory: (id: string) => void;
}

export default function Channels(props: ChannelsProps): JSX.Element {
  const {
    activeGroup,
    channels,
    categories,
    groups,
    setPage,
    createChannel,
    setCategory,
  } = props;

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const showGroupSettings = () => {
    setShowSettings(!showSettings);
  };

  const groupCategories = categories.filter(
    ({ groupId }) => groupId === activeGroup
  );
  const activeGroupObject = groups.find(({ _id }) => _id === activeGroup);

  const springProps = useSpring({
    config: { ...config.gentle },
    opacity: showSettings ? "1" : "0",
    transform: showSettings ? `translateY(0)` : `translateY(-50%)`,
    display: showSettings ? "flex" : "none",
  } as any);

  return (
    <div className="channel">
      <div className="channel-title active-group" onClick={showGroupSettings}>
        {activeGroupObject && activeGroupObject.groupName}
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
          <div
            className="dropdown-item"
            onClick={() => {
              createCategory(activeGroup);
            }}
          >
            Create Category
          </div>
          <div className="dropdown-item">Some settings</div>
          <div className="dropdown-item">Some settings</div>
        </div>
      </animated.div>
      {groupCategories &&
        groupCategories.map((category: Category) => {
          return (
            <SingleCategory
              key={category._id}
              category={category}
              channels={channels}
              createChannel={createChannel}
              setCategory={setCategory}
              updateCategory={updateCategory}
            />
          );
        })}
    </div>
  );
}

/*

import ButtonAdd from "../../../assets/images/add-circle.png";
import PacMan from "../../../assets/images/pacman.png";
import Sonic from "../../../assets/images/sonic.png";
import TeacherBot from "../../../assets/images/teacher-bot.png";
import Support from "../../../assets/images/support.png";
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
      */
