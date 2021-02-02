import React, { CSSProperties, PropsWithChildren } from "react";

interface ButtonBasicProps {
  style?: CSSProperties;
  id?: string;
  className?: string;
  margin?: string;
  width?: string;
  height?: string;
  onClick: () => void;
}

export default function ButtonSimple(
  props: PropsWithChildren<ButtonBasicProps>
): JSX.Element {
  const {
    children,
    id,
    className,
    style,
    margin,
    height,
    width,
    onClick,
  } = props;
  return (
    <div
      onClick={onClick}
      id={id}
      className={`button-basic ${className}`}
      style={{ margin, width, height, ...style }}
    >
      {children}
    </div>
  );
}
