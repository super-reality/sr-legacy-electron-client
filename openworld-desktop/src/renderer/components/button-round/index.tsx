import React, { CSSProperties } from "react";
import "../buttons.scss";

interface ButtonRoundProps {
  svg: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  style?: CSSProperties;
  height: string;
  width: string;
}

export default function ButtonRound(props: ButtonRoundProps): JSX.Element {
  const { svg, style, height, width } = props;
  const SvgElement = svg;
  return (
    <div className="button-round" style={{ ...style, width, height }}>
      <SvgElement className="svg-icon" />
    </div>
  );
}
