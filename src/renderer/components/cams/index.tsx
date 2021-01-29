import "./index.scss";
import React from "react";

import PacMan from "../../../assets/images/pacman.png";
import Camss from "../../../assets/images/cams-screen.png";
import Camss2 from "../../../assets/images/cams-screen2.png";
import Voting from "../../../assets/svg/updown.svg";

export default function Cams(): JSX.Element {
  return (
    <>
      <div className="cams-title">Cams</div>
      <div className="cams-container">
        <div className="cams">
          <div className="single-cam">
            <div className="cam-title">
              Sonic
              <div className="voting">
                <img src={Voting} alt="" />
              </div>
            </div>
            <div className="cam">
              <img src={Camss} alt="Cam1" />
              <div className="user-avatar">
                <img src={PacMan} alt="" />
              </div>
            </div>
          </div>
          <div className="single-cam">
            <div className="cam-title">
              Sonic
              <div className="voting">
                <img src={Voting} alt="" />
              </div>
            </div>
            <div className="cam">
              <img src={Camss2} alt="cam2" />
              <div className="user-avatar">
                <img src={PacMan} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
