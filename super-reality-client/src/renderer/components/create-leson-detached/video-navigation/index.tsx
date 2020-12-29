/* eslint-disable react/jsx-props-no-spreading */
import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import {
  SliderModeFunction,
  Slider,
  Rail,
  Handles,
  Tracks,
  GetRailProps,
  GetHandleProps,
  GetTrackProps,
  SliderItem,
  Ticks,
} from "react-compound-slider";
import "../../containers.scss";
import "./index.scss";

const customMode: SliderModeFunction = (curr, next) => {
  const newNext = next;
  let changed = -1;
  for (let i = 0; i < curr.length; i += 1) {
    if (curr[i].val !== next[i].val) {
      changed = i;
    }
    if (changed == 0) {
      if (next[0].val >= curr[1].val * 0.99) {
        newNext[0].val = curr[1].val;
      }
    }

    if (changed == 1) {
      if (next[0].val == curr[1].val) newNext[0].val = next[1].val;
      if (next[2].val == curr[1].val) newNext[2].val = next[1].val;
    }

    if (changed == 2) {
      if (curr[1].val >= next[2].val * 0.99) {
        newNext[2].val = curr[1].val;
      }
    }
  }

  return newNext;
}; // snapping mode

function formatTime(time: number): string {
  const minutes = `${Math.floor(time / 1000)}`.padStart(2, "0");
  const seconds = `${time % 1000}`.padStart(3, "0");

  return `${minutes}:${seconds}`;
}

interface SliderRailProps {
  getRailProps: GetRailProps;
}

function SliderRail({ getRailProps }: SliderRailProps) {
  return (
    <>
      <div className="video-railOuter" {...getRailProps()} />
      <div className="video-railInner" />
    </>
  );
}

interface HandleProps {
  index: number;
  domain: number[];
  handle: SliderItem;
  getHandleProps: GetHandleProps;
  disabled?: boolean;
}

function Handle({
  domain: [min, max],
  handle: { id, value, percent },
  disabled = false,
  index,
  getHandleProps,
}: HandleProps) {
  return (
    <>
      <div
        className={`video-handle-${index}`}
        style={{
          left: `${percent}%`,
        }}
        {...getHandleProps(id)}
      />
      <div
        className={`video-handle-time time-${index}`}
        style={{
          left: `${percent}%`,
        }}
      >
        {formatTime(value)}
      </div>
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          left: `${percent}%`,
          backgroundColor: disabled ? "#666" : undefined,
        }}
      />
    </>
  );
}

interface TrackProps {
  source: SliderItem;
  target: SliderItem;
  getTrackProps: GetTrackProps;
  disabled?: boolean;
}

function Track({
  source,
  target,
  getTrackProps,
  disabled = false,
}: TrackProps) {
  return (
    <div
      className="video-track"
      style={{
        backgroundColor: disabled ? "#999" : undefined,
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  );
}

interface TickProps {
  tick: SliderItem;
  count: number;
  index: number;
}

function Tick({ tick, count, index }: TickProps) {
  return (
    <div>
      <div
        className={`video-tickPre${index % 10 ? "-small" : ""}`}
        style={{
          left: `${tick.percent}%`,
        }}
      />
      {index % 10 == 0 && (
        <div
          className="video-tick"
          style={{
            // marginLeft: `${-(100 / count) / 2}%`,
            width: `${100 / count}%`,
            left: `${tick.percent}%`,
          }}
        >
          {formatTime(tick.value)}
        </div>
      )}
    </div>
  );
}

interface VideoNavigationProps {
  domain: number[];
  defaultValues: number[];
  step?: number;
  callback?: (n: readonly number[]) => void;
  slideCallback?: (n: readonly number[]) => void;
  disabled?: boolean;
  ticksNumber?: number;
  style?: CSSProperties;
  /**
   * Sync the first track background with the other tracks. Default to false
   */
  isBackgroundSync?: boolean;
}

const sliderStyle = {
  position: "relative" as any,
  width: "100%",
  touchAction: "none",
};

export default function VideoNavigation(
  props: VideoNavigationProps
): JSX.Element {
  const {
    domain,
    defaultValues,
    step,
    callback,
    slideCallback,
    disabled,
    ticksNumber,
    style,
    isBackgroundSync = false,
  } = props;

  const [state, setState] = useState<readonly number[]>(defaultValues.slice());

  useEffect(() => {
    if (!isEqual(state, defaultValues)) {
      setState(defaultValues);
    }
  }, [state, defaultValues]);

  const memoizedTicks = useMemo(() => {
    return (
      <Ticks count={ticksNumber}>
        {({ ticks }) => (
          <div className="video-slider-ticks">
            {ticks.map((tick, index) => (
              <Tick
                index={index}
                key={tick.id}
                tick={tick}
                count={ticks.length}
              />
            ))}
          </div>
        )}
      </Ticks>
    );
  }, [domain]);

  return (
    <div className="video-video-nav">
      <div
        style={{
          height: "100px",
          display: "flex",
          alignItems: "flex-start",
          paddingTop: "26px",
          width: "calc(100% - 16px)",
          margin: "auto",
          ...style,
        }}
      >
        <Slider
          mode={customMode}
          step={step || 10}
          disabled={disabled}
          domain={domain}
          rootStyle={sliderStyle}
          onUpdate={slideCallback}
          onChange={callback}
          values={state}
        >
          <Rail>
            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="video-slider-handles">
                {handles.map((handle, index) => (
                  <Handle
                    index={index}
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks right={false}>
            {({ tracks, getTrackProps }) => (
              <div className="video-slider-tracks">
                {tracks
                  .filter((t, i) => i > 0)
                  .map(({ id, source, target }, idx) =>
                    isBackgroundSync ? (
                      <Track
                        key={id}
                        source={idx === 0 ? source : tracks[0].target}
                        target={
                          idx === 0 ? tracks[tracks.length - 1].target : target
                        }
                        getTrackProps={getTrackProps}
                      />
                    ) : (
                      <Track
                        key={id}
                        source={source}
                        target={target}
                        getTrackProps={getTrackProps}
                      />
                    )
                  )}
              </div>
            )}
          </Tracks>
          {ticksNumber && memoizedTicks}
        </Slider>
      </div>
    </div>
  );
}
