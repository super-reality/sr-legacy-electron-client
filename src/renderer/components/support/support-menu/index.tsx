import "./index.scss";

import Vivus from "vivus";
import { RouteComponentProps, useNavigate, useLocation } from "@reach/router";
import { useEffect, useState } from "react";
import { ReactComponent as SupportIcon } from "../../../../assets/svg/support-icon.svg";
import SupportAskIcon from "../../../../assets/svg/support-ask.svg";
import SupportHelpIcon from "../../../../assets/svg/support-help.svg";
import { setSidebarWidth } from "../../../../utils/setSidebarWidth";

export default function SupportMenu(props: RouteComponentProps): JSX.Element {
  console.log(props);
  const navigate = useNavigate();
  const location = useLocation();
  const [giveAnimation, setGiveAnimation] = useState<any>();
  const [askAnimation, setAskAnimation] = useState<any>();

  useEffect(() => {
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
          onClick={() => {
            navigate("give");
            console.log(location.pathname);
          }}
          className="support-choice"
          onMouseEnter={() => {
            if (giveAnimation) giveAnimation.reset();
            if (giveAnimation) giveAnimation.play();
          }}
          onMouseLeave={() => {
            if (giveAnimation) giveAnimation.finish();
          }}
        >
          <div id="give" />
          <div className="support-choice-title">Give suppport</div>
        </div>
        <div
          onClick={() => navigate("ask")}
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
