import React from "react";
import "./index.scss";
import { NavLink, useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring";

interface TopNavItemProps {
  title: string;
  route: string;
}

const topNavButtons: string[][] = [
  ["/test", "Test"],
  ["/find", "Find"],
  ["/learn", "Learn"],
  ["/teach", "Teach"],
  ["/connect", "Connect"],
];

function TopNavItem(props: TopNavItemProps): JSX.Element {
  const location = useLocation();
  const isActive = location.pathname === props.route;
  return (
    <NavLink exact to={props.route}>
      <div className={`topnav-item ${isActive && "selected"}`}>
        {props.title}
      </div>
    </NavLink>
  );
}

export default function TopNav(): JSX.Element {
  const location = useLocation();

  let from = "0px";
  topNavButtons.forEach((b, index) => {
    const isActive = location.pathname === b[0];
    if (isActive) {
      from = `${index * 64}px`;
    }
  });

  const props = useSpring({ marginLeft: from });

  return (
    <div className={"topnav-container"}>
      <div>
        <div className={"topnav-navs-container"}>
          {topNavButtons.map((b) => (
            <TopNavItem route={b[0]} title={b[1]} />
          ))}
        </div>
        <div
          className={"topnav-indicator-container"}
          style={{ width: `${topNavButtons.length * 64}px` }}
        >
          <animated.div className={"topnav-indicator"} style={props} />
        </div>
      </div>
    </div>
  );
}
