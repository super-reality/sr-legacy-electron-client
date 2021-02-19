import React from "react";
import "./index.scss";
import Vivus from "vivus";
import { ReactComponent as SupportIcon } from "../../../../assets/svg/support-icon.svg";
import SupportAskIcon from "../../../../assets/svg/support-ask.svg";
import SupportHelpIcon from "../../../../assets/svg/support-help.svg";
import { chooseOption, ASK, SEARCH } from "..";
import { setSidebarWidth } from "../../../../utils/setSidebarWidth";

export default function SupportMenu(): JSX.Element {
  const [giveAnimation, setGiveAnimation] = React.useState<any>();
  const [askAnimation, setAskAnimation] = React.useState<any>();

  React.useEffect(() => {
    setGiveAnimation(
      new Vivus("give", {
        duration: 100,
        file: SupportHelpIcon,
        animTimingFunction: Vivus.EASE_IN,
      })
    );
    setAskAnimation(
      new Vivus("ask", {
        duration: 100,
        file: SupportAskIcon,
        animTimingFunction: Vivus.EASE_IN,
      })
    );
    setSidebarWidth(700);
  }, []);

  return (
    <div className="support support-container">
      <SupportIcon />
      <div className="support-container-title">Support</div>
      <div className="support-choices">
        <div
          onClick={() => chooseOption(SEARCH)}
          className="support-choice"
          onMouseEnter={() => {
            giveAnimation.reset();
            giveAnimation.play();
          }}
          onMouseLeave={() => {
            giveAnimation.finish();
          }}
        >
          <div id="give" />
          <div className="support-choice-title">Give suppport</div>
        </div>
        <div
          onClick={() => chooseOption(ASK)}
          className="support-choice"
          onMouseEnter={() => {
            askAnimation.reset();
            askAnimation.play();
          }}
          onMouseLeave={() => {
            askAnimation.finish();
          }}
        >
          <div id="ask" />
          <div className="support-choice-title">Ask for Help</div>
        </div>
      </div>
    </div>
  );
}
