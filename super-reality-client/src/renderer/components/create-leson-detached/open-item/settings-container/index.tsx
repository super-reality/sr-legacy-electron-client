import React, { CSSProperties, PropsWithChildren } from "react";
import "./index.scss";

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
