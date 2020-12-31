import "./index.scss";
import React from "react";

import Sonic from "../../../assets/images/sonic.png";
import Nick from "../../../assets/images/Nick.png";
import Pacman from "../../../assets/images/pacman.png";
import { ReactComponent as SendButton } from "../../../assets/svg/send.svg";

export default function Chat(): JSX.Element {
  return (
    <>
      <div className="title">Chat</div>
      <div className="chat-container">
        <div className="chats">
          <div className="single-chat">
            <img className="avatar" src={Sonic} alt="sonic" />
            <div className="info">
              <div className="user">Sonic</div>
              <div className="timestamp">Dec 22,2020</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>

          <div className="single-chat">
            <img className="avatar" src={Nick} alt="Nick Mark" />
            <div className="info">
              <div className="user">Nick Marks</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">Thank you so much!</div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
          <div className="single-chat">
            <img className="avatar" src={Pacman} alt="Nick Mark" />
            <div className="info">
              <div className="user">Pac-Girl</div>
              <div className="timestamp">Today at 12:30pm</div>
            </div>
            <div className="message">
              I love this lesson! Thanks so much for making it!
            </div>
          </div>
        </div>
        <div className="chat-input">
          <input type="text" placeholder="You rock!" />
          <SendButton />
        </div>
      </div>
    </>
  );
}
