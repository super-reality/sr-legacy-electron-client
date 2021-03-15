import React, { CSSProperties, PropsWithChildren } from "react";

interface FlexProps {
  column?: boolean;
  style?: CSSProperties;
}

export default function Flex(props: PropsWithChildren<FlexProps>): JSX.Element {
  const { style, column, children } = props;
  return (
    <div
      style={{
        flexDirection: column ? "column" : undefined,
        ...style,
        display: "flex",
      }}
    >
      {children}
    </div>
  );
}
