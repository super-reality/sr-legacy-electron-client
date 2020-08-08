import React, {useState, useEffect} from "react";
import "./index.scss";
import {ReactComponent as SearchIcon} from "../../../assets/svg/search.svg";
import {ReactComponent as BackIcon} from "../../../assets/svg/back.svg";
import {ReactComponent as AlertIcon} from "../../../assets/svg/alert.svg";
import {useSelector} from "react-redux";
import {AppState} from "../../redux/stores/renderer";
import { useSpring, animated } from "react-spring";

export default function TopSearch(): JSX.Element {
  const offset = 45;
  const {yScroll, yScrollDelta} = useSelector(
    (state: AppState) => state.render
  );
  const [yPos, setYPos] = useState(offset);

  useEffect(() => {
    if (yScrollDelta > 0) {
      setYPos(offset);
    } else if (yPos + offset < yScroll) {
      setYPos(-yScroll + offset);
    }
  }, [yPos, yScrollDelta, yScroll]);

  const spring = useSpring({top: `${yPos}px`});

  return (
    <animated.div style={spring} className="top-controls">
      <BackIcon
        style={{margin: "auto 0 auto 8px"}}
        width="42px"
        fill="var(--color-section)"
      />
      <div className="top-input-container">
        <input className="top-input" />
        <SearchIcon
          style={{margin: "auto 8px"}}
          width="20px"
          height="20px"
          fill="var(--color-text)"
        />
      </div>
      <AlertIcon
        style={{margin: "auto 8px auto 0"}}
        width="42px"
        fill="var(--color-section)"
      />
    </animated.div>
  );
}
