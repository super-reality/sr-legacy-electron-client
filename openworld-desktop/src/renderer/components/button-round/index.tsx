import React, { CSSProperties } from "react";
import "../buttons.scss";

interface ButtonRoundProps {
  svg: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  style?: CSSProperties;
  iconFill?: string;
  height: string;
  width: string;
  onClick: () => void;
}

export default function ButtonRound(props: ButtonRoundProps): JSX.Element {
  const { onClick, svg, style, height, width, iconFill } = props;
  const SvgElement = svg;
  return (
    <div
      onClick={onClick}
      className="button-round"
      style={{ ...style, width, height }}
    >
      <SvgElement className="svg-icon" fill={iconFill || "var(--color-icon)"} />
    </div>
  );
}
