import React from "react";
import "./index.scss";
import { useSpring, animated } from "react-spring";

interface LoadingProps {
  state: boolean;
}

export default function Loading(props: LoadingProps) {
  const { state } = props;

  const spring = useSpring({
    opacity: state ? 1 : 0,
    display: state ? "flex" : "none",
  } as any);

  return (
    <animated.div style={spring} className="loader-container">
      <div className="spinner">
        <div className="rect1" />
        <div className="rect2" />
        <div className="rect3" />
        <div className="rect4" />
        <div className="rect5" />
      </div>
    </animated.div>
  );
}
