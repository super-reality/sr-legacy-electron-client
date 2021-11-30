import { CSSProperties, PropsWithChildren } from "react";
import "../buttons.scss";

interface ButtonSimpleProps {
  style?: CSSProperties;
  id?: string;
  disabled?: boolean;
  className?: string;
  margin?: string;
  width?: string;
  height?: string;
  onClick?: (e: any) => void;
}

export default function ButtonSimple(
  props: PropsWithChildren<ButtonSimpleProps>
): JSX.Element {
  const {
    children,
    id,
    disabled,
    className,
    style,
    margin,
    height,
    width,
    onClick,
  } = props;

  return (
    <div
      onClick={disabled == true ? undefined : onClick}
      id={id}
      className={`button-simple ${className} ${disabled ? "disabled" : ""}`}
      style={{ margin, width, height, ...style }}
    >
      {children}
    </div>
  );
}
