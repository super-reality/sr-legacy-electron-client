import React, { CSSProperties, PropsWithChildren } from "react";

interface FlexProps {
  style?: CSSProperties;
}

export default function Flex(props: PropsWithChildren<FlexProps>): JSX.Element {
  const { style, children } = props;
  return <div style={{ ...style, display: "flex" }}>{children}</div>;
}
