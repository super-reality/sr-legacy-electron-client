import React from "react";
import { StepSectionProps } from "..";

import PacMan from "../../../../assets/images/pacman.png";
import ButtonTick from "../../../../assets/svg/button-tick.svg";

export default function StepProfileSharing(
  props: StepSectionProps
): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { goNext, goBack } = props;

  const progressBar = {
    width: "60%",
    height: "7px",
    background: "#D130B5",
    borderRadius: "2px",
  };

  return (
    <div>
      <div className="title">Step 4 of 5</div>
      <div className="step">
        <div className="step-title">Identity Sharing</div>
        Your data is your data! Choose what parts of your Super Reality profile
        to share. Sharing your profile helps Support staff solve problems
        quicker.
        <div className="skill">
          Identities
          <div className="identities">
            <div className="channel-container">
              <div className="single-channel">
                <img className="avatar" src={PacMan} alt="" />
                <div className="info">Game Gen</div>
              </div>
            </div>
            <div className="progress-button">
              Emotions
              <img src={ButtonTick} alt="" />
              <div className="blue-bar">
                <div className="pink-bar-progress" style={progressBar} />
              </div>
            </div>
            <div className="progress-button">
              Engagement
              <img src={ButtonTick} alt="" />
              <div className="blue-bar">
                <div className="pink-bar-progress" style={progressBar} />
              </div>
            </div>
            <div className="progress-button">
              Relationships
              <img src={ButtonTick} alt="" />
              <div className="blue-bar">
                <div className="pink-bar-progress" style={progressBar} />
              </div>
            </div>
            <div className="progress-button">
              Meaning
              <img src={ButtonTick} alt="" />
              <div className="blue-bar">
                <div className="pink-bar-progress" style={progressBar} />
              </div>
            </div>
            <div className="progress-button">
              Accomplishments
              <img src={ButtonTick} alt="" />
              <div className="blue-bar">
                <div className="pink-bar-progress" style={progressBar} />
              </div>
            </div>
            <div className="progress-button">
              Physical Health
              <img src={ButtonTick} alt="" />
              <div className="blue-bar">
                <div className="pink-bar-progress" style={progressBar} />
              </div>
            </div>
            <div className="single-channel">
              <img className="avatar" src={PacMan} alt="" />
              <div className="info">Westside</div>
            </div>
            <div className="single-channel">
              <img className="avatar" src={PacMan} alt="" />
              <div className="info">Matt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
