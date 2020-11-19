import { current } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useMemo, useState } from "react";
// import iohook from "iohook";
import { ReactComponent as RecordIcon } from "../../../../assets/svg/record.svg";
import { ReactComponent as StopIcon } from "../../../../assets/svg/stop.svg";
import { ReactComponent as PlayIcon } from "../../../../assets/svg/play.svg";
import ButtonRound from "../../button-round";
import Flex from "../../flex";
import ReactSelect from "../../top-select";
import Windowlet from "../windowlet";
import CVRecorder from "./CVRecorder";

const leftButtonId = 1;
const rightButtonId = 2;
const wheelButtonId = 3;
const scrollDownId = 1;
const scrollUpId = -1;

interface RecorderProps {
  onFinish: () => void;
}

export default function Recorder(props: RecorderProps): JSX.Element {
  const { onFinish } = props;
  const [count, setCount] = useState(-1);
  const [recording, setRecording] = useState(false);
  const [sources, setSources] = useState<Record<string, any>>({});
  const [currentSource, setCurrentSource] = useState<string>("Entire Screen");
  const [timePassed, setTimePassed] = useState<string[]>([]);

  const recorder: any = useMemo(() => new CVRecorder(), []);
  // const recordTimer: string[] = useMemo(
  //   () => recorder.currentTimer.split(":"),
  //   [recorder.currentTimer]
  // );

  useEffect(() => {
    const get = async () => {
      // eslint-disable-next-line global-require
      const { desktopCapturer } = require("electron");
      const inputSources = await desktopCapturer.getSources({
        types: ["window", "screen"]
      });
      const data: Record<string, any> = {};
      inputSources.forEach((source: any) => {
        data[source.name as string] = source;
      });
      setSources(data);
    };

    get();

    // new event listeners using iohook
    // eslint-disable-next-line no-undef
    const iohook = __non_webpack_require__("iohook");
    iohook.load();
    iohook.start();
    iohook.on("mousedown", (event: any) => {
      if (recorder.recordingStarted) {
        if (event.button === leftButtonId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "left_click"
          ];
        }
        if (event.button === rightButtonId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "right_click"
          ];
        }
        if (event.button === wheelButtonId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "wheel_click"
          ];
        }

        console.log("click registered ==>", recorder.currentTimer);
      }
    });

    iohook.on("mouseup", (event: any) => {
      if (recorder.recordingStarted) {
        if (event.button === leftButtonId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "left_release"
          ];
        }
        if (event.button === rightButtonId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "right_release"
          ];
        }
        if (event.button === wheelButtonId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "wheel_release"
          ];
        }

        console.log("release registered ==>", recorder.currentTimer);
      }
    });

    iohook.on("mousewheel", (event: any) => {
      if (recorder.recordingStarted) {
        if (event.rotation === scrollDownId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "scroll_down"
          ];
        }
        if (event.rotation === scrollUpId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "scroll_up"
          ];
        }
        console.log("mousewheel registered ==>", recorder.currentTimer);
      }
    });

    iohook.on("keydown", (event: any) => {
      if (recorder.recordingStarted) {
        recorder.clickEventDetails = [
          event.x,
          event.y,
          recorder.currentTimer,
          event.type,
          event
        ];
        console.log("keyboard key clicked ==>", recorder.currentTimer);
      }
    });

    iohook.on("keyup", (event: any) => {
      // console.log(event)
      if (recorder.recordingStarted) {
        recorder.clickEventDetails = [
          event.x,
          event.y,
          recorder.currentTimer,
          event.type,
          event
        ];
        console.log("keyboard key released ==>", recorder.currentTimer);
      }
    });
  }, [recorder]);

  const stopRecord = useCallback(() => {
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    remote.globalShortcut.unregister("F10");
    recorder.stop();
    setRecording(false);
    // eslint-disable-next-line no-undef
    const iohook = __non_webpack_require__("iohook");
    iohook.unload();
    iohook.stop();
    onFinish();
  }, [recorder, onFinish]);

  const startRecord = useCallback(() => {
    // eslint-disable-next-line global-require
    const { remote, desktopCapturer } = require("electron");
    const recordTimer = recorder.currentTimer.split(":");
    setCount(-1);
    setRecording(true);
    setTimePassed([recordTimer[0], recordTimer[1], recordTimer[2]]);

    desktopCapturer
      .getSources({
        types: ["window", "screen"]
      })
      .then(all => {
        const s = all.filter(c => c.name == currentSource)[0] || sources[0];
        console.log(sources, currentSource);
        console.log(s);
        recorder.start(s);
      });

    remote.globalShortcut.register("F10", stopRecord);
  }, [currentSource, sources, recorder, stopRecord]);

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => setCount(count - 1), 1000);
    }
    if (count == 0) {
      startRecord();
    }
  }, [count, startRecord]);

  useEffect(() => {
    if (recording) {
      const recordTimer = recorder.currentTimer.split(":");
      setTimePassed([recordTimer[0], recordTimer[1], recordTimer[2]]);
    }
  }, [recorder.currentTimer, recording]);

  console.log("recorder", recorder.currentTimer);
  console.log("state", timePassed);
  return (
    <>
      {count > -1 && !recording ? (
        <Windowlet
          title="Super Reality Recorder"
          width={298}
          height={320}
          onClose={onFinish}
        >
          <video muted autoPlay style={{ width: "100%", height: "100%" }}>
            <source src="countdown.mp4" type="video/mp4" />
          </video>
        </Windowlet>
      ) : (
        <></>
      )}
      {count == -1 && !recording ? (
        <Windowlet
          title="Super Reality Recorder"
          width={320}
          height={140}
          onClose={onFinish}
        >
          <Flex column style={{ height: "100%" }}>
            <Flex
              style={{ margin: "auto 16px", justifyContent: "space-between" }}
            >
              <ReactSelect
                style={{ width: "200px" }}
                options={Object.keys(sources)}
                current={currentSource}
                callback={name => {
                  setCurrentSource(name);
                }}
              />
              <ButtonRound
                svg={RecordIcon}
                svgStyle={{
                  width: "36px",
                  height: "36px"
                }}
                width="48px"
                height="48px"
                onClick={() => setCount(3)}
              />
            </Flex>
            <div style={{ margin: "4px auto auto auto" }}>
              Press F10 to stop recording
            </div>
          </Flex>
        </Windowlet>
      ) : (
        <></>
      )}
      {recording ? (
        <Windowlet
          title="Super Reality Recorder"
          width={320}
          height={100}
          onClose={onFinish}
        >
          <Flex
            style={{
              margin: "16px 16px",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Flex>
              {recorder.currentTimer.length ? (
                <p style={{ margin: 0 }}>
                  {timePassed[0]}:{timePassed[1]}:{timePassed[2]}
                </p>
              ) : (
                <p style={{ margin: 0 }}>00:00:00</p>
              )}
            </Flex>
            <Flex style={{ width: "25%" }}>
              <input type="range" style={{ width: "100%", margin: 0 }} />
            </Flex>
            {/* <div> here goes the slider for sound </div> */}
            <ButtonRound
              svg={PlayIcon}
              svgStyle={{
                width: "1rem",
                height: "1rem",
                cursor: "pointer"
              }}
              width="28px"
              height="28px"
              onClick={stopRecord /* should be resume play */}
            />

            <ButtonRound
              svg={PlayIcon}
              svgStyle={{
                width: "1rem",
                height: "1rem",
                cursor: "pointer"
              }}
              width="28px"
              height="28px"
              onClick={stopRecord /* should be resume play */}
            />
            <ButtonRound
              svg={StopIcon}
              svgStyle={{
                width: "1rem",
                height: "1rem",
                cursor: "pointer"
              }}
              width="28px"
              height="28px"
              onClick={stopRecord}
            />
          </Flex>
        </Windowlet>
      ) : (
        <></>
      )}
    </>
  );
}
