/* eslint-disable react/jsx-props-no-spreading */

import React from "react";
import { GetHandleProps, SliderItem } from "react-compound-slider";
import "./index.scss";

interface HandleProps {
  domain: ReadonlyArray<number>;
  handle: SliderItem;
  getHandleProps: GetHandleProps;
}

const RecroderHandle: React.FC<HandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  getHandleProps
}: HandleProps): JSX.Element => {
  return (
    <div
      className="handle"
      role="slider"
      aria-aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      style={{
        left: `${percent}%`
      }}
      {...getHandleProps(id)}
    />
  );
};

export default RecroderHandle;
