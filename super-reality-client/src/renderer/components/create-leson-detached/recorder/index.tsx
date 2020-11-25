import React, { useCallback, useEffect, useMemo, useState } from "react";
// import iohook from "iohook";
import { ReactComponent as RecordIcon } from "../../../../assets/svg/record.svg";
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
  const [windowSources, setWindowSources] = useState<
    Electron.DesktopCapturerSource[]
  >([]);
  const [screenSources, setScreenSources] = useState<
    Electron.DesktopCapturerSource[]
  >([]);
  const [currentSource, setCurrentSource] = useState<string>("");

  const recorder: any = useMemo(() => new CVRecorder(), []);

  const updateSources = useCallback((): Promise<
    Electron.DesktopCapturerSource[]
  > => {
    const update = async () => {
      // eslint-disable-next-line global-require
      const { desktopCapturer } = require("electron");

      // Set windows
      const allWindowSources = await desktopCapturer.getSources({
        types: ["window"],
      });
      const windows: Electron.DesktopCapturerSource[] = [];
      allWindowSources.forEach((source) => {
        windows.push(source);
      });
      setWindowSources(windows);

      // Set screens
      const allScreenSources = await desktopCapturer.getSources({
        types: ["screen"],
      });
      const screens: Electron.DesktopCapturerSource[] = [];
      allScreenSources.forEach((source) => {
        screens.push(source);
      });
      setScreenSources(screens);

      return [...screens, ...windows];
    };

    return update();
  }, []);

  useEffect(() => {
    updateSources().then((a) => {
      setCurrentSource(a[0].name);
    });
  }, [updateSources]);

  const stopRecord = useCallback(() => {
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    remote.globalShortcut.unregister("F10");
    recorder.stop();
    // setRecording(false);
    // eslint-disable-next-line no-undef
    const iohook = __non_webpack_require__("iohook");
    iohook.unload();
    iohook.stop();
    onFinish();
  }, [recorder, onFinish]);

  const getCurrentSource = useCallback(
    (sources: Electron.DesktopCapturerSource[]) => {
      return (
        sources.filter((c: any) => c.name == currentSource)[0] ||
        Object.values(screenSources)[0]
      );
    },
    [currentSource, screenSources]
  );

  const startRecord = useCallback(() => {
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    setCount(-1);
    setRecording(true);

    updateSources().then((all) => {
      const s = getCurrentSource(all);
      console.log(s);
      recorder.start(s);
    });

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
            "left_click",
          ];
        }
        if (event.button === rightButtonId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "right_click",
          ];
        }
        if (event.button === wheelButtonId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "wheel_click",
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
            "left_release",
          ];
        }
        if (event.button === rightButtonId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "right_release",
          ];
        }
        if (event.button === wheelButtonId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "wheel_release",
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
            "scroll_down",
          ];
        }
        if (event.rotation === scrollUpId) {
          recorder.clickEventDetails = [
            event.x,
            event.y,
            recorder.currentTimer,
            "scroll_up",
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
          event,
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
          event,
        ];
        console.log("keyboard key released ==>", recorder.currentTimer);
      }
    });

    remote.globalShortcut.register("F10", stopRecord);
  }, [currentSource, screenSources, windowSources, recorder]);

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => setCount(count - 1), 1000);
    }
    if (count == 0) {
      startRecord();
    }
  }, [count, startRecord]);

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
          width={540}
          height={200}
          onClose={onFinish}
        >
          <Flex column style={{ height: "100%" }}>
            <Flex
              style={{ margin: "auto 16px", justifyContent: "space-between" }}
            >
              <Flex style={{ width: "200px", height: "120px" }}>
                <Flex
                  style={{
                    margin: "auto",
                    maxHeight: "120px",
                    maxWidth: "200px",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  {currentSource && (
                    <img
                      src={`data:image/jpeg;base64,${getCurrentSource([
                        ...screenSources,
                        ...windowSources,
                      ])
                        .thumbnail.toPNG()
                        .toString("base64")}`}
                    />
                  )}
                </Flex>
              </Flex>
              <ReactSelect
                style={{ width: "200px" }}
                options={[...screenSources, ...windowSources].map(
                  (s) => s.name
                )}
                current={currentSource}
                callback={(name) => {
                  setCurrentSource(name);
                }}
              />
              <ButtonRound
                svg={RecordIcon}
                svgStyle={{
                  width: "36px",
                  height: "36px",
                }}
                style={{
                  margin: "auto 16px",
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
    </>
  );
}
