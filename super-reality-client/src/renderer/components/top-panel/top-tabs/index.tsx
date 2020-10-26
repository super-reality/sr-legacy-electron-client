import React, { CSSProperties, PropsWithChildren, useState } from "react";
import "./index.scss";

interface TopTabsProps<T> {
  buttons: T[];
  initial: T;
  callback: (button: T) => void;
  height?: string;
  style?: CSSProperties;
  icons?: React.FunctionComponent<any>[];
  className?: string;
  
  
}

export function TopTabs<T extends string>(props: TopTabsProps<T>): JSX.Element {
  const { buttons, initial, callback, height, style, icons, className } = props;
 
  const [value, setValue] = useState<T>(initial);

  return (
    <div className={`top-tabs-tab-container ${className}`}>
      {buttons.map((str, i) => {
        const Icon = icons ? icons[i] : undefined;
        return (
          <div
            key={str}
            className={`top-tabs-tab${value == str ? "-selected" : ""}`}
            style={{
              width: `calc(${Math.round(100 / buttons.length)}%)`,
              height: height || "32px",
              lineHeight: height || "32px",
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

interface TopTabsContainerProps {
  style?: CSSProperties;
}

export function TopTabsContainer(props: PropsWithChildren<TopTabsContainerProps>) {
  const { children, style } = props;
  return (
    <div className="top-tabs-content-container" style={style}>
      {children}
    </div>
  );
}
