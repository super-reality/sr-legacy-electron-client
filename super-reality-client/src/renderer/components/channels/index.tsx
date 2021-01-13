import "./index.scss";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/stores/renderer";

import ButtonAdd from "../../../assets/images/add-circle.png";

import PacMan from "../../../assets/images/pacman.png";
import Sonic from "../../../assets/images/sonic.png";
import TeacherBot from "../../../assets/svg/teacher-bot.svg";
import { ReactComponent as Support } from "../../../assets/svg/support.svg";

export default function Channels(): JSX.Element {
  const { groups } = useSelector((state: AppState) => state.chat);
  return (
    <div className="channel">
      <div className="channel-container">
        {groups.map((group: any) => {
          return (
            <div className="single-channel" key={group._id}>
              <img className="avatar" src={group.groupPhoto} alt="" />
              <div className="info">{group.groupName}</div>
            </div>
          );
        })}
      </div>
      <div className="title">Super Powers</div>
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
      <div className="title">Rooms</div>
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
      <div className="title">Mentors</div>
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
      <div className="title">Game</div>
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
