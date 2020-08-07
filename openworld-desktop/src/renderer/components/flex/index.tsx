import React, { CSSProperties, PropsWithChildren} from "react";

interface FlexProps {
  style?: CSSProperties;
}

export default function Flex(props: PropsWithChildren<FlexProps>): JSX.Element {
  return (
    <div style={{...props.style, display: "flex"}} >
      {props.children}
    </div>
  );
}
