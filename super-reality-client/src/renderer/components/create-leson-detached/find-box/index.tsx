import React from "react";
import "./index.scss";

interface FindBoxProps {
  pos: { x: number; y: number; width: number; height: number };
}

export default function FindBox(props: FindBoxProps): JSX.Element {
  const { pos } = props;

  return (
    <div
      className="find-box anchor"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${pos.width}px`,
        height: `${pos.height}px`,
      }}
    />
  );
}
