import "./index.scss";
import React from "react";

import ButtonAdd from "../../../assets/images/add-circle.png";

import PacMan from "../../../assets/images/pacman.png";
import Sonic from "../../../assets/images/sonic.png";
import TeacherBot from "../../../assets/svg/teacher-bot.svg";
import { ReactComponent as Help } from "../../../assets/svg/support.svg";
import Support from "../support";

export default function Channels(): JSX.Element {
  return (
    <div className="channel-wrapper">
      <div className="channel">
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
              <Help />
              <div className="info">Support</div>
            </div>
            <div className="single-channel">
              <img className="avatar" src={TeacherBot} alt="" />
              <div className="info">Teacher Bot</div>
            </div>
          </div>
          <div className="channel-container">
            <div className="channels">
              <div className="single-channel">
                <img className="avatar" src={PacMan} alt="" />
                <div className="info">Support</div>
              </div>
              <div className="single-channel">
                <img className="avatar" src={PacMan} alt="" />
                <div className="info">Get Help</div>
              </div>
              <div className="single-channel">
                <img className="avatar" src={Sonic} alt="" />
                <div className="info">Give Help</div>
              </div>
              <div className="single-channel">
                <img className="avatar" src={PacMan} alt="" />
                <div className="info">Requests</div>
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
      </div>
      <Support />
    </div>
  );
}
