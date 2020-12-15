import React, { CSSProperties } from "react";
import "../buttons.scss";

interface ButtonRoundProps {
  svg: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  style?: CSSProperties;
  svgStyle?: CSSProperties;
  iconFill?: string;
  disabled?: boolean;
  height: string;
  width: string;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function ButtonRound(props: ButtonRoundProps): JSX.Element {
  const {
    onClick,
    svg,
    style,
    svgStyle,
    height,
    width,
    iconFill,
    disabled,
  } = props;
  const SvgElement = svg;
  return (
    <div
      onClick={onClick}
      className={`button-round ${disabled ? "disabled" : ""}`}
      style={{ ...style, width, height }}
    >
      <SvgElement
        className="svg-icon"
        style={svgStyle}
        fill={
          disabled
            ? "var(--color-text-disabled)"
            : iconFill || "var(--color-blue)"
        }
      />
    </div>
  );
}
