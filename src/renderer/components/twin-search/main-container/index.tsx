import { ReactComponent as MicIcon } from "../../../../assets/svg/mic-icon.svg";
import { ReactComponent as ThreeDots } from "../../../../assets/svg/three-dots-horizontal.svg";
import TestUser from "../../../../assets/images/user-thinking.jpg";
import Einstain from "../../../../assets/images/albert-einstein.jpg";
import "./index.scss";
import ButtonRound from "../../button-round";
import { voidFunction } from "../../../constants";

export default function TwinSearchMain() {
  const twinName = "Albert Einstain";
  const category = "collective";
  return (
    <div className="main">
      <div className="search-results-container">
        <div className="twin-container">
          <div className="twin-info-container">
            <div className="twin-icon">
              <img src={Einstain} alt="" />
            </div>
            <div className="header-body-container">
              <div className="twin-header">
                <div className="name-category-container">
                  <span className="name-twin">{twinName}</span>
                  {` - ${category}`}
                </div>
                <div className="path-progress-container">
                  <div className="path-progress">math path 8%</div>
                  <div className="progress-menu">
                    <ThreeDots />
                  </div>
                </div>
              </div>
              <div className="twin-body">
                <div className="twin-about">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Dolore eaque animi illum obcaecati ratione ducimus quas vitae
                  exercitationem ad quo ea cupiditate nam recusandae sit
                  aliquid, harum ipsam dolores doloribus!
                </div>
                <div className="twin-question">
                  Can I help you understand the unverse?
                </div>
              </div>
            </div>
          </div>

          <div className="twin-question-container">
            <div className="user-avatar">
              <img src={TestUser} alt="" />
            </div>
            <input type="text" />
            <ButtonRound
              onClick={voidFunction}
              svg={MicIcon}
              width="28px"
              height="20px"
            />
          </div>
        </div>

        <div className="twin-container">
          <div className="twin-info-container">
            <div className="twin-icon">
              <img src={Einstain} alt="" />
            </div>
            <div className="header-body-container">
              <div className="twin-header">
                <div className="name-category-container">
                  <span className="name-twin">{twinName}</span>
                  {` - ${category}`}
                </div>
                <div className="path-progress-container">
                  <div className="path-progress">math path 8%</div>
                  <div className="progress-menu">
                    <ThreeDots />
                  </div>
                </div>
              </div>
              <div className="twin-body">
                <div className="twin-about">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Dolore eaque animi illum obcaecati ratione ducimus quas vitae
                  exercitationem ad quo ea cupiditate nam recusandae sit
                  aliquid, harum ipsam dolores doloribus!
                </div>
                <div className="twin-question">
                  Can I help you understand the unverse?
                </div>
              </div>
            </div>
          </div>

          <div className="twin-question-container">
            <div className="user-avatar">
              <img src={TestUser} alt="" />
            </div>
            <input type="text" />
            <ButtonRound
              onClick={voidFunction}
              svg={MicIcon}
              width="28px"
              height="20px"
            />
          </div>
        </div>

        <div className="twin-container">
          <div className="twin-info-container">
            <div className="twin-icon">
              <img src={Einstain} alt="" />
            </div>
            <div className="header-body-container">
              <div className="twin-header">
                <div className="name-category-container">
                  <span className="name-twin">{twinName}</span>
                  {` - ${category}`}
                </div>
                <div className="path-progress-container">
                  <div className="path-progress">math path 8%</div>
                  <div className="progress-menu">
                    <ThreeDots />
                  </div>
                </div>
              </div>
              <div className="twin-body">
                <div className="twin-about">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Dolore eaque animi illum obcaecati ratione ducimus quas vitae
                  exercitationem ad quo ea cupiditate nam recusandae sit
                  aliquid, harum ipsam dolores doloribus!
                </div>
                <div className="twin-question">
                  Can I help you understand the unverse?
                </div>
              </div>
            </div>
          </div>

          <div className="twin-question-container">
            <div className="user-avatar">
              <img src={TestUser} alt="" />
            </div>
            <input type="text" />
            <ButtonRound
              onClick={voidFunction}
              svg={MicIcon}
              width="28px"
              height="20px"
            />
          </div>
        </div>

        <div className="twin-container">
          <div className="twin-info-container">
            <div className="twin-icon">
              <img src={Einstain} alt="" />
            </div>
            <div className="header-body-container">
              <div className="twin-header">
                <div className="name-category-container">
                  <span className="name-twin">{twinName}</span>
                  {` - ${category}`}
                </div>
                <div className="path-progress-container">
                  <div className="path-progress">math path 8%</div>
                  <div className="progress-menu">
                    <ThreeDots />
                  </div>
                </div>
              </div>
              <div className="twin-body">
                <div className="twin-about">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Dolore eaque animi illum obcaecati ratione ducimus quas vitae
                  exercitationem ad quo ea cupiditate nam recusandae sit
                  aliquid, harum ipsam dolores doloribus!
                </div>
                <div className="twin-question">
                  Can I help you understand the unverse?
                </div>
              </div>
            </div>
          </div>

          <div className="twin-question-container">
            <div className="user-avatar">
              <img src={TestUser} alt="" />
            </div>
            <input type="text" />
            <ButtonRound
              onClick={voidFunction}
              svg={MicIcon}
              width="28px"
              height="20px"
            />
          </div>
        </div>

        <div className="twin-container">
          <div className="twin-info-container">
            <div className="twin-icon">
              <img src={Einstain} alt="" />
            </div>
            <div className="header-body-container">
              <div className="twin-header">
                <div className="name-category-container">
                  <span className="name-twin">{twinName}</span>
                  {` - ${category}`}
                </div>
                <div className="path-progress-container">
                  <div className="path-progress">math path 8%</div>
                  <div className="progress-menu">
                    <ThreeDots />
                  </div>
                </div>
              </div>
              <div className="twin-body">
                <div className="twin-about">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Dolore eaque animi illum obcaecati ratione ducimus quas vitae
                  exercitationem ad quo ea cupiditate nam recusandae sit
                  aliquid, harum ipsam dolores doloribus!
                </div>
                <div className="twin-question">
                  Can I help you understand the unverse?
                </div>
              </div>
            </div>
          </div>

          <div className="twin-question-container">
            <div className="user-avatar">
              <img src={TestUser} alt="" />
            </div>
            <input type="text" />
            <ButtonRound
              onClick={voidFunction}
              svg={MicIcon}
              width="28px"
              height="20px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
