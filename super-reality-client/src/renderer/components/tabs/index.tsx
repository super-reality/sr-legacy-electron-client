import React, { CSSProperties, PropsWithChildren, useState } from "react";
import "./index.scss";

interface TabsProps<T> {
  buttons: T[];
  initial: T;
  callback: (button: T) => void;
  height?: string;
  style?: CSSProperties;
  icons?: React.FunctionComponent<any>[];
}

export function Tabs<T extends string>(props: TabsProps<T>): JSX.Element {
  const { buttons, initial, callback, height, style, icons } = props;
  const [value, setValue] = useState<T>(initial);

  return (
    <div className="tabs-tab-container">
      {buttons.map((str, i) => {
        const Icon = icons ? icons[i] : undefined;
        return (
          <div
            key={str}
            className={`tabs-tab${value == str ? "-selected" : ""}`}
            style={{
              width: `calc(${Math.round(100 / buttons.length)}%)`,
              height: height || "28px",
              lineHeight: height || "28px",
              ...style,
            }}
            onClick={() => {
              setValue(str);
              callback(str);
            }}
          >
            {Icon ? (
              <Icon
                fill={
                  value == str
                    ? "var(--color-text-active)"
                    : "var(--color-icon)"
                }
              />
            ) : (
              str
            )}
          </div>
        );
      })}
    </div>
  );
}

interface TabsContainerProps {
  style?: CSSProperties;
}

export function TabsContainer(props: PropsWithChildren<TabsContainerProps>) {
  const { children, style } = props;
  return (
    <div className="tabs-content-container" style={style}>
      {children}
    </div>
  );
}
