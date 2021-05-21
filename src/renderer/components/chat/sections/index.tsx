import "./index.scss";
import { useState } from "react";
import { useSpring, animated, config } from "react-spring";
import { useDispatch } from "react-redux";
import { Group } from "../../../../types/chat";

// import ButtonAdd from "../../../../assets/images/add-circle.png";
import PacMan from "../../../../assets/images/pacman.png";
import Sonic from "../../../../assets/images/sonic.png";
import TeacherBot from "../../../../assets/images/teacher-bot.png";
import Support from "../../../../assets/images/support.png";
import reduxAction from "../../../redux/reduxAction";
import { createCategory } from "../../../../utils/chat-utils/categories-services";

interface SectionsProps {
  activeGroup: string;
  groups: Group[];
}

export default function GroupSections(props: SectionsProps): JSX.Element {
  const { activeGroup, groups } = props;

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const dispatch = useDispatch();

  const showGroupSettings = () => {
    setShowSettings(!showSettings);
  };

  const activeGroupObject = groups.find(({ _id }) => _id === activeGroup);
  const setSettingsType = () => {
    console.log("setSettingsType");
    // reduxAction(dispatch, {
    //   type: "UPDATE_GROUP",
    //   arg: "group",
    // });
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
        {activeGroupObject && activeGroupObject.groupName}
      </div>
      <animated.div style={{ ...springProps }}>
        <div className="group-settings-dropdown">
          <div
            className="dropdown-item"
            onClick={() => {
              setSettingsType();
              // openSettings();
            }}
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

/*

      <div className="channel">
      <div className="channel-title active-group" onClick={showGroupSettings}>
        {activeGroupObject && activeGroupObject.groupName}
      </div>
      <animated.div style={{ ...springProps }}>
        <div className="group-settings-dropdown">
          <div
            className="dropdown-item"
            onClick={() => {
              setSettingsType();
              openSettings();
            }}
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
              openSettings={openSettings}
            />
          );
        })}
    </div>
      */
