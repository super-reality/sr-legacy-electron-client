import "./index.scss";
import React from "react";

import IconTitle from "../../../assets/svg/title.svg";
import IconDescription from "../../../assets/svg/description.svg";
import IconSkills from "../../../assets/svg/skills.svg";
import IconProfileSharing from "../../../assets/svg/profile-sharing.svg";
import IconReview from "../../../assets/svg/review.svg";
import IconCircleTick from "../../../assets/svg/circle-tick.svg";

import StepTitle from "./step-title";
import StepDescription from "./step-description";
import StepSkills from "./step-skills";
import StepProfileSharing from "./step-profile-sharing";


export default function Help(): JSX.Element {
  return (
    <div className="help">
      <div className="help-list">
        <div className="title">New Request</div>
        <ul>
          <li className="active">
            <a>Title</a>
            <img src={IconTitle} />
            <div className="progress-step">
              <img src={IconCircleTick} alt="" />
            </div>
          </li>
          <li>
            <a>Description</a>
            <img src={IconDescription} />
            <div className="progress-step">
              <img src={IconCircleTick} alt="" />
            </div>
          </li>
          <li>
            <a>Skills</a>
            <img src={IconSkills} />
            <div className="progress-step">
              <img src={IconCircleTick} alt="" />
            </div>
          </li>
          <li>
            <a>Profile Sharing</a>
            <img src={IconProfileSharing} />
            <div className="progress-step">
              <img src={IconCircleTick} alt="" />
            </div>
          </li>
          <li>
            <a>Review</a>
            <img src={IconReview} />
            <div className="progress-step">
              <img src={IconCircleTick} alt="" />
            </div>
          </li>
        </ul>
      </div>

      <div className="help-steps">
        <StepTitle />

        <StepDescription />

        <StepSkills />

        <StepProfileSharing />
      </div>
    </div>
  );
}
