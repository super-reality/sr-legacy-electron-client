/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as RecordIcon } from "../../../assets/svg/record.svg";
import { ReactComponent as StopIcon } from "../../../assets/svg/stop.svg";
import { ReactComponent as PauseIcon } from "../../../assets/svg/pause.svg";
import { ReactComponent as ResetIcon } from "../../../assets/svg/restart.svg";
import { ReactComponent as PlayIcon } from "../../../assets/svg/play.svg";
import ButtonRound from "../button-round";
import Flex from "../flex";
import ReactSelect from "../react-select";
import Windowlet from "../windowlet";
import CVRecorder from "./CVRecorder";

import "./index.scss";
import { voidFunction } from "../../constants";

// eslint-disable-next-line no-undef
const activeWin = __non_webpack_require__("active-win");

const leftButtonId = 1;
const rightButtonId = 2;
const wheelButtonId = 3;
const scrollDownId = 1;
const scrollUpId = -1;

export default function Recorder(): JSX.Element {
  const [count, setCount] = useState(-1);
  const [recording, setRecording] = useState(false);
  const [windowSources, setWindowSources] = useState<
    Electron.DesktopCapturerSource[]
  >([]);
  const [screenSources, setScreenSources] = useState<
    Electron.DesktopCapturerSource[]
  >([]);
  const [currentSource, setCurrentSource] = useState<string>("");
  const [_ticks, setTicks] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const recorder: any = useMemo(() => new CVRecorder(), []);

  const history = useHistory();
  const closeRecorder = useCallback(() => {
    history.goBack();
  }, [history]);

  const processEvent = useCallback(
    (
      x: number,
      y: number,
      currentTime,
      eventType,
      keyboardDetails
    ): Promise<[string, string, string]> => {
      return new Promise((resolve, reject) => {
        console.log(
          `x: ${x}, y: ${y}`,
          currentTime,
          eventType,
          keyboardDetails
        );
        try {
          if (!recorder.recordingStarted) reject();
          else {
            activeWin().then((activeWindowDetails: any) => {
              let title = "";
              let processOwnerName = "";
              if (activeWindowDetails != undefined) {
                title = activeWindowDetails.title;
                processOwnerName = activeWindowDetails.owner.name;
              }

              recorder.clickEventDetails = [
                x,
                y,
                currentTime,
                eventType,
                keyboardDetails,
                title,
                processOwnerName,
              ];

              resolve([processOwnerName, title, currentTime]);
            });
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    [recorder]
  );

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
      allWindowSources.forEach((source: any) => {
        windows.push(source);
      });
      setWindowSources(windows);

      // Set screens
      const allScreenSources = await desktopCapturer.getSources({
        types: ["screen"],
      });
      const screens: Electron.DesktopCapturerSource[] = [];
      allScreenSources.forEach((source: any) => {
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
    setRecording(false);
    // eslint-disable-next-line no-undef
    const iohook = __non_webpack_require__("iohook");
    iohook.removeAllListeners("mousedown");
    iohook.removeAllListeners("mouseup");
    iohook.removeAllListeners("mousewheel");
    iohook.removeAllListeners("keydown");
    iohook.removeAllListeners("keyup");
    iohook.unload();
    iohook.stop();
    closeRecorder();
  }, [recorder, closeRecorder]);

  const getCurrentSource = useCallback(
    (sources: Electron.DesktopCapturerSource[]) => {
      return (
        sources.filter((c) => c.name == currentSource)[0] ||
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
      const timerOnClick = recorder.currentTimer;
      if (event.button === leftButtonId) {
        processEvent(event.x, event.y, timerOnClick, "left_click", "")
          .then((arr) => recorder.titlesQueue.push(arr[1]))
          .catch(console.error);
      }

      if (event.button === rightButtonId) {
        processEvent(event.x, event.y, timerOnClick, "right_click", "")
          .then((arr) => recorder.titlesQueue.push(arr[1]))
          .catch(console.error);
      }

      if (event.button === wheelButtonId) {
        processEvent(event.x, event.y, timerOnClick, "wheel_click", "")
          .then((arr) => recorder.titlesQueue.push(arr[1]))
          .catch(console.error);
      }
    });

    iohook.on("mouseup", (event: any) => {
      const timerOnRelease = recorder.currentTimer;
      if (event.button === leftButtonId)
        processEvent(event.x, event.y, timerOnRelease, "left_release", "");

      if (event.button === rightButtonId)
        processEvent(event.x, event.y, timerOnRelease, "right_release", "");

      if (event.button === wheelButtonId)
        processEvent(event.x, event.y, timerOnRelease, "wheel_release", "");
    });

    iohook.on("mousewheel", (event: any) => {
      const timerOnScroll = recorder.currentTimer;
      if (event.rotation === scrollDownId)
        processEvent(event.x, event.y, timerOnScroll, "scroll_down", "");

      if (event.rotation === scrollUpId)
        processEvent(event.x, event.y, timerOnScroll, "scroll_up", "");
    });

    iohook.on("keydown", (event: any) => {
      const timerOnKeydown = recorder.currentTimer;
      processEvent(event.x, event.y, timerOnKeydown, event.type, event);
    });

    iohook.on("keyup", (event: any) => {
      const timerOnKeyup = recorder.currentTimer;
      processEvent(event.x, event.y, timerOnKeyup, event.type, event);
    });

    remote.globalShortcut.register("F10", stopRecord);
  }, [processEvent, recorder, updateSources, getCurrentSource]);

  const pauseRecord = useCallback((): void => {
    recorder.pause();
    setIsPaused(true);
  }, [recorder]);

  const resumeRecord = useCallback((): void => {
    recorder.resume();
    setIsPaused(false);
  }, [recorder]);

  const resetRecord = useCallback((): void => {
    recorder.delete();
    setRecording(false);
  }, [recorder]);

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => setCount(count - 1), 1000);
    }
    if (count == 0) {
      startRecord();
    }
  }, [count, startRecord]);

  useEffect(() => {
    if (recording && !isPaused) {
      const timer = setInterval(() => {
        setTicks(new Date().getTime());
      }, 200);

      return () => clearInterval(timer);
    }
    return voidFunction;
  }, [recording, recorder, isPaused]);

  const recordTimer = recorder.currentTimer.split(":");
  const timePassed = [recordTimer[0], recordTimer[1], recordTimer[2]];
  return (
    <>
      {count > -1 && !recording ? (
        <Windowlet
          title="Super Reality Recorder"
          width={298}
          height={320}
          onClose={closeRecorder}
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
          onClose={closeRecorder}
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
          </Flex>
        </Windowlet>
      ) : (
        <></>
      )}
      {recording ? (
        <Windowlet
          title="Super Reality Recorder"
          width={300}
          height={100}
          onClose={closeRecorder}
          initialPosX={98}
          initialPosY={98}
          style={{ backgroundColor: "#2f3136" }}
        >
          <Flex
            style={{
              margin: "16px 16px",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Flex
              style={{
                width: "33%",
                backgroundColor: "#202225",
                justifyContent: "center",
                alignItems: "center",
                height: 28,
                borderRadius: 4,
              }}
            >
              {recorder.currentTimer.length ? (
                <p style={{ margin: 0 }}>
                  {timePassed[0]}:{timePassed[1]}:{timePassed[2]}
                </p>
              ) : (
                <p style={{ margin: 0 }}>00:00:00</p>
              )}
            </Flex>
            {/* <div
              style={{
                width: "33%",
                height: 32,
                display: "block",
                margin: "auto"
              }}
            >
              <BaseSlider
                domain={[0, 100]}
                step={1}
                defaultValues={[50]}
                style={{ width: "80%" }}
              />
            </div> */}
            <Flex style={{ width: "40%", justifyContent: "space-between" }}>
              <ButtonRound
                svg={ResetIcon}
                svgStyle={{
                  width: "1rem",
                  height: "1rem",
                  cursor: "pointer",
                }}
                width="28px"
                height="28px"
                onClick={resetRecord}
                style={{ backgroundColor: "#202225" }}
              />
              {isPaused ? (
                <ButtonRound
                  svg={PlayIcon}
                  svgStyle={{
                    width: "1rem",
                    height: "1rem",
                    cursor: "pointer",
                  }}
                  width="28px"
                  height="28px"
                  onClick={resumeRecord}
                  style={{ backgroundColor: "#202225" }}
                />
              ) : (
                <ButtonRound
                  svg={PauseIcon}
                  svgStyle={{
                    width: "1rem",
                    height: "1rem",
                    cursor: "pointer",
                  }}
                  width="28px"
                  height="28px"
                  onClick={pauseRecord}
                  style={{ backgroundColor: "#202225" }}
                />
              )}
              <ButtonRound
                svg={StopIcon}
                svgStyle={{
                  width: "1rem",
                  height: "1rem",
                  cursor: "pointer",
                }}
                width="28px"
                height="28px"
                onClick={stopRecord}
                style={{ backgroundColor: "#202225" }}
              />
            </Flex>
          </Flex>
        </Windowlet>
      ) : (
        <></>
      )}
    </>
  );
}
