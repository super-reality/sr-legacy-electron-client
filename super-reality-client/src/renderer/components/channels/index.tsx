import "./index.scss";
import React, { useState } from "react";

import ButtonAdd from "../../../assets/svg/add-circle.svg";

import PacMan from "../../../assets/images/pacman.png";
import Sonic from "../../../assets/images/sonic.png";
import ButtonBasic from "../button-basic";
import Flex from "../flex";

/* CHANNELS */
import Support from "./support-channel";

const NONE = 0;
const SUPPORT = 1;
const GETHELP = 2;
const GIVEHELP = 3;

type channel = typeof NONE | typeof SUPPORT | typeof GETHELP | typeof GIVEHELP;

export default function Channels(): JSX.Element {
  const [currentchannel, setCurrentChannel] = useState<channel>(SUPPORT);
  return (
    <Flex>
      <div className="channel">
        <div className="title">Tools</div>
        <div className="add">
          <button type="button">
            <img src={ButtonAdd} />
          </button>
        </div>
        <div className="channel-container">
          <div className="channels">
            <ButtonBasic
              className="single-channel"
              onClick={() => setCurrentChannel(SUPPORT)}
            >
              <img className="avatar" src={PacMan} alt="" />
              <div className="info">Support</div>
            </ButtonBasic>
            <ButtonBasic
              className="single-channel"
              onClick={() => setCurrentChannel(GETHELP)}
            >
              <img className="avatar" src={PacMan} alt="" />
              <div className="info">Get Help</div>
            </ButtonBasic>
            <ButtonBasic
              className="single-channel"
              onClick={() => setCurrentChannel(GIVEHELP)}
            >
              <img className="avatar" src={Sonic} alt="" />
              <div className="info">Give Help</div>
            </ButtonBasic>
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
      {currentchannel != NONE && (
        <div>
          {currentchannel == SUPPORT && <Support />}
          {currentchannel == GETHELP && <h1>Get Help</h1>}
          {currentchannel == GIVEHELP && <h1>Give Help</h1>}
        </div>
      )}
    </Flex>
  );
}
