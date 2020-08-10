import React, {useState, useEffect} from "react";
import "./index.scss";
import {ReactComponent as SearchIcon} from "../../../assets/svg/search.svg";
import {ReactComponent as BackIcon} from "../../../assets/svg/back.svg";
import {ReactComponent as AlertIcon} from "../../../assets/svg/alert.svg";
import Select from "../select";
import {useSelector} from "react-redux";
import {AppState} from "../../redux/stores/renderer";
import {useSpring, animated} from "react-spring";
import {useLocation} from "react-router-dom";
import Flex from "../flex";

const selectOptionsByTab: Record<string, string[]> = {
  "/find": [
    "All",
    "Subjects",
    "Organization",
    "Collection",
    "Teachers",
    "Student",
    "Wanted",
    "Teacher Bot",
  ],
  "/learn": [
    "All My Stuff",
    "My Lessons",
    "My Subjects",
    "My Organizations",
    "My Collections",
    "My Teachers",
    "My Classmates",
    "My Teacher Bot",
  ],
};

export default function TopSearch(): JSX.Element {
  const location = useLocation();
  const currentOptions = selectOptionsByTab[location.pathname];
  const showSelect = currentOptions ? true : false;
  const [currentSelected, setCurrentSelected] = useState(
    showSelect ? currentOptions[0] : ""
  );

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

  useEffect(() => {
    setCurrentSelected(showSelect ? currentOptions[0] : "");
    // eslint-disable-next-line
  }, [location]);

  return (
    <animated.div style={spring} className={`top-controls ${!showSelect ? "no-select" : ""}`}>
      <BackIcon
        style={{margin: "auto"}}
        width="42px"
        fill="var(--color-section)"
      />
      <Flex>
        <div className="top-input-container">
          <input className="top-input" />
            <div className={"top-inpu-icon"}>
            <SearchIcon
              width="20px"
              height="20px"
              fill="var(--color-text)"
            />
          </div>
        </div>
      </Flex>
      {currentOptions ? (
        <Select
          style={{width: "auto"}}
          current={currentSelected}
          callback={setCurrentSelected}
          options={currentOptions}
        />
      ) : (
        <></>
      )}
      <AlertIcon
        style={{margin: "auto"}}
        width="42px"
        fill="var(--color-section)"
      />
    </animated.div>
  );
}
