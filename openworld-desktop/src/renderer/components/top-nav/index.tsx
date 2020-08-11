import React, { useState, useCallback } from "react";
import "./index.scss";
import { NavLink, useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useMeasure } from "react-use";

interface TopNavItemProps {
  title: string;
  route: string;
}

const topNavButtons: string[][] = [
  ["/test", "Test"],
  ["/find", "Find"],
  ["/learn", "Learn"],
  ["/teach", "Teach"],
  ["/profile", "100"],
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

const navItemSize = 64;

export default function TopNav(): JSX.Element {
  const location = useLocation();
  const [xScroll, setXScroll] = useState(0);
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const diff = (topNavButtons.length * navItemSize) - width;

  let from = "0px";
  topNavButtons.forEach((b, index) => {
    const isActive = location.pathname === b[0];
    if (isActive) {
      from = `${index * navItemSize}px`;
    }
  });

  if (xScroll !== 0 && diff <= 0) {
    setXScroll(0);
  }

  const handleScroll = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    let newScroll = Math.min(0, xScroll + (event.deltaY / 5));
    newScroll = Math.max(diff * -1, newScroll);
    setXScroll(newScroll);
    // eslint-disable-next-line
  }, [xScroll]);

  const props = useSpring({ marginLeft: from });

  return (
    <div ref={ref} className={"topnav-container"}>
      <div onWheel={handleScroll}>
        <div style={{ left: `${xScroll}px` }} className={"topnav-navs-container"}>
          {topNavButtons.map((b) => (
            <TopNavItem key={b[0]} route={b[0]} title={b[1]} />
          ))}
        </div>
        <div
          className={"topnav-indicator-container"}
          style={{ left: `${xScroll}px`, width: `${topNavButtons.length * navItemSize}px` }}
        >
          <animated.div className={"topnav-indicator"} style={props} />
        </div>
      </div>
    </div>
  );
}
