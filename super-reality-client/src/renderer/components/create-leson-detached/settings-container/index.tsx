import React, { CSSProperties, PropsWithChildren, ReactChildren } from "react";
import "./index.scss";

import Flex from "../../flex";

interface SettingsContainerProps {
  style?: CSSProperties;
}

export default function ItemSettingsContainer(
  props: PropsWithChildren<SettingsContainerProps>
): JSX.Element {
  const { style, children } = props;
  return (
    <div style={style} className="settings-container">
      {children}
    </div>
  );
}
