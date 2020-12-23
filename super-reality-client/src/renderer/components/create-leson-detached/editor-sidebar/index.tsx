import React, { useState } from "react";
import "./index.scss";
import { animated, useSpring } from "react-spring";

export default function EditorSidebar() {
  const [expaded, setExpanded] = useState(false);

  const props = useSpring({ width: expaded ? "240px" : "0px" });

  return (
    <>
      <animated.div style={props} className="sidebar-expanded" />
      <div className="sidebar-buttons" onClick={() => setExpanded(!expaded)} />
    </>
  );
}
