import "./index.scss";

import PacMan from "../../../assets/images/pacman.png";
import Screencast from "../../../assets/images/screencast.png";

export default function Screenshare(): JSX.Element {
  return (
    <>
      <div className="screenshare-title">Screenshares</div>
      <div className="screenshare-container">
        <div className="screens">
          <div className="single-screen">
            <div className="screen-title">Pac-Girl</div>
            <div className="screen">
              <img src={Screencast} alt="" />
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
