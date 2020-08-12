import React, { CSSProperties, PropsWithChildren } from "react";
import "../buttons.scss";

interface ButtonSimpleProps {
  style?: CSSProperties;
  margin?: string;
  width?: string;
  height?: string;
  onClick: () => void;
}

export default function ButtonSimple(
  props: PropsWithChildren<ButtonSimpleProps>
): JSX.Element {
  const { children, style, margin, height, width, onClick } = props;

  return (
    <div
      onClick={onClick}
      className="button-simple"
      style={{ margin, width, height, ...style }}
    >
      {children}
    </div>
  );
}
