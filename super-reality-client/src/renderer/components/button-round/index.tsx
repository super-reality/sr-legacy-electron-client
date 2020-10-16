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
  height: string;
  width: string;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function ButtonRound(props: ButtonRoundProps): JSX.Element {
  const { onClick, svg, style, svgStyle, height, width, iconFill } = props;
  const SvgElement = svg;
  return (
    <div
      onClick={onClick}
      className="button-round"
      style={{ ...style, width, height }}
    >
      <SvgElement
        className="svg-icon"
        style={svgStyle}
        fill={iconFill || "var(--color-icon)"}
      />
    </div>
  );
}
