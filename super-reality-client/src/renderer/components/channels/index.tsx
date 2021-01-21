import "./index.scss";
import React, { useState } from "react";
import { useSpring, animated, config } from "react-spring";
import useResizeObserver from "use-resize-observer";
import ButtonAdd from "../../../assets/images/add-circle.png";

import PacMan from "../../../assets/images/pacman.png";
import Sonic from "../../../assets/images/sonic.png";
import TeacherBot from "../../../assets/svg/teacher-bot.svg";
import { ReactComponent as Support } from "../../../assets/svg/support.svg";
import { Group } from "../../../types/chat";
import { PagesIndex } from "../../../types/browser";

interface ChannelsProps {
  activeGroup: Group;
  setPage: (pageIndex: any) => void;
}

export default function Channels(props: ChannelsProps): JSX.Element {
  const { activeGroup, setPage } = props;
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const showGroupSettings = () => {
    setShowSettings(!showSettings);
  };

  const { ref, height } = useResizeObserver();
  const springProps = useSpring({
    config: { ...config.molasses },
    height: showSettings ? height : "0px",
  });

  return (
    <div className="channel">
      <div className="channel-title active-group" onClick={showGroupSettings}>
        {activeGroup.collectiveName}
      </div>
      <animated.div
        style={{ ...springProps, overflow: "hidden", position: "relative" }}
      >
        <div ref={ref} className="group-settings-dropdown">
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
        <button type="button">
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
