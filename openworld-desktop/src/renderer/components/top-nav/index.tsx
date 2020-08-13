import React, { useState, useCallback, useEffect } from "react";
import "./index.scss";
import { NavLink, useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useMeasure } from "react-use";
import playSound from "../../../utils/playSound";

interface TopNavItemProps {
  title: string;
  route: string;
}

function TopNavItem(props: TopNavItemProps): JSX.Element {
  const { route, title } = props;
  const location = useLocation();
  const isActive = location.pathname === route;
  return (
    <NavLink exact to={route}>
      <div className={`topnav-item ${isActive && "selected"}`}>{title}</div>
    </NavLink>
  );
}

const navItemSize = 64;

export default function TopNav(): JSX.Element {
  const location = useLocation();
  const [xScroll, setXScroll] = useState(0);
  const [lastKnown, setLastKnown] = useState("");
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const topNavButtons: string[][] = [
    // ["/test", "Test"],
    ["/discover", "Discover"],
    ["/learn", "Learn"],
    ["/teach", "Teach"],
    ["/me", "100"],
  ];

  useEffect(() => {
    if (
      lastKnown !== location.pathname &&
      topNavButtons.filter((arr) => arr[0] == location.pathname).length > 0
    ) {
      setLastKnown(location.pathname);
    }
  }, [lastKnown, location]);

  const diff = topNavButtons.length * navItemSize - width;

  let from = "0px";
  topNavButtons.forEach((b, index) => {
    const isActive = lastKnown === b[0];
    if (isActive) {
      from = `${index * navItemSize}px`;
    }
  });

  if (xScroll !== 0 && diff <= 0) {
    setXScroll(0);
  }

  const handleScroll = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      let newScroll = Math.min(0, xScroll + event.deltaY / 5);
      newScroll = Math.max(diff * -1, newScroll);
      setXScroll(newScroll);
      // eslint-disable-next-line
  }, [xScroll]);

  const props = useSpring({ marginLeft: from });

  return (
    <div ref={ref} className="topnav-container">
      <div onWheel={handleScroll}>
        <div
          style={{ left: `${xScroll}px` }}
          className="topnav-navs-container"
          onClick={() => {
            playSound("./sounds/top-menu.wav");
          }}
        >
          {topNavButtons.map((b) => (
            <TopNavItem key={b[0]} route={b[0]} title={b[1]} />
          ))}
        </div>
        <div
          className="topnav-indicator-container"
          style={{
            left: `${xScroll}px`,
            width: `${topNavButtons.length * navItemSize}px`,
          }}
        >
          <animated.div className="topnav-indicator" style={props} />
        </div>
      </div>
    </div>
  );
}
