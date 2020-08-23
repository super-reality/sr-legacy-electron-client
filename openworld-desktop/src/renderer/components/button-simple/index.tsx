import React, { CSSProperties, PropsWithChildren } from "react";
import "../buttons.scss";

interface ButtonSimpleProps {
  style?: CSSProperties;
  className?: string;
  margin?: string;
  width?: string;
  height?: string;
  onClick: () => void;
}

export default function ButtonSimple(
  props: PropsWithChildren<ButtonSimpleProps>
): JSX.Element {
  const { children, className, style, margin, height, width, onClick } = props;

  return (
    <div
      onClick={onClick}
      className={`button-simple ${className}`}
      style={{ margin, width, height, ...style }}
    >
      {children}
    </div>
  );
}
