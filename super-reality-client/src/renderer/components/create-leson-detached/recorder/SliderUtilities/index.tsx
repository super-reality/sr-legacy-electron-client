/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */

import React from "react";
import {
  GetHandleProps,
  SliderItem,
  GetTrackProps
} from "react-compound-slider";
import "./index.scss";

interface HandleProps {
  domain: ReadonlyArray<number>;
  handle: SliderItem;
  getHandleProps: GetHandleProps;
}

export const RecorderHandle = ({
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
        left: `${percent}%`,
        position: "absolute",
        marginLeft: "-11px",
        marginTop: "-6px",
        zIndex: 2,
        width: 24,
        height: 5,
        cursor: "pointer",
        borderRadius: "50%"
      }}
      {...getHandleProps(id)}
    />
  );
};

interface TrackProps {
  source: SliderItem;
  target: SliderItem;
  getTrackProps: GetTrackProps;
}

export const Track = ({ source, target, getTrackProps }: TrackProps) => (
  <div
    style={{
      position: "absolute",
      height: 5,
      zIndex: 1,
      backgroundColor: "#7aa0c4",
      borderRadius: 7,
      cursor: "pointer",
      left: `${source.percent}%`,
      width: `${target.percent - source.percent}%`
    }}
    {...getTrackProps()}
  />
);
