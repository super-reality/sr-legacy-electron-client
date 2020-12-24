import React, { useState } from "react";
import "./index.scss";
import { animated, useSpring } from "react-spring";

import { ReactComponent as DummyOne } from "../../../../assets/svg/new-fx-icon.svg";
import { ReactComponent as DummyTwo } from "../../../../assets/svg/add-video.svg";
import ButtonRound from "../../button-round";

const sidebarIcons = [
  {
    title: "dummy one",
    icon: DummyOne,
    component: <>Dummy One</>,
  },
  {
    title: "dummy two",
    icon: DummyTwo,
    component: (
      <>{`Dummy Two Title! put a whole jsx component here, like "<Component>"`}</>
    ),
  },
];

export default function EditorSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [current, setCurrent] = useState(0);

  const props = useSpring({
    width: expanded ? "300px" : "0px",
    minWidth: expanded ? "300px" : "0px",
  });

  return (
    <>
      <animated.div style={props} className="sidebar-expanded">
        <div className="sidebar-content">
          {sidebarIcons[current]?.component}
        </div>
      </animated.div>
      <div className="sidebar-buttons">
        {sidebarIcons.map((icon, index) => {
          return (
            <ButtonRound
              onClick={() => {
                setCurrent(index);
                if (index == current || !expanded) setExpanded(!expanded);
              }}
              width="32px"
              height="32px"
              key={icon.title}
              svg={icon.icon}
              title={icon.title}
            />
          );
        })}
      </div>
    </>
  );
}
