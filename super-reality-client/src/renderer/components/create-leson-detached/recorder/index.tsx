import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactComponent as RecordIcon } from "../../../../assets/svg/record.svg";
import ButtonRound from "../../button-round";
import Flex from "../../flex";
import ReactSelect from "../../top-select";
import Windowlet from "../windowlet";
import CVRecorder from "./CVRecorder";

// eslint-disable-next-line no-undef

/*
  need to import iohook 
*/ 
const mouseEvents = __non_webpack_require__("global-mouse-events");

interface RecorderProps {
  onFinish: () => void;
}

export default function Recorder(props: RecorderProps): JSX.Element {
  const { onFinish } = props;
  const [count, setCount] = useState(-1);
  const [recording, setRecording] = useState(false);
  const [sources, setSources] = useState<Record<string, any>>({});
  const [currentSource, setCurrentSource] = useState<string>("Entire Screen");

  const recorder: any = useMemo(() => new CVRecorder(), []);

  useEffect(() => {
    const get = async () => {
      // eslint-disable-next-line global-require
      const { desktopCapturer } = require("electron");
      const inputSources = await desktopCapturer.getSources({
        types: ["window", "screen"],
      });
      const data: Record<string, any> = {};
      inputSources.forEach((source: any) => {
        data[source.name as string] = source;
      });
      setSources(data);
    };

    get();

    /*
      dont need this
    */

    // mouseEvents.on("mousedown", (event: any) => {
    //   if (recorder.recordingStarted) {
    //     // clickEventTriggered = true;
    //     // rec.pixelCordinates.x = event.x
    //     // rec.pixelCordinates.y = event.y
    //     recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer];
    //     console.log("click registered ==>", recorder.currentTimer);
    //   } else {
    //     // console.log(rec.clickEventDetails)
    //     // console.log(rec.currentTimer);
    //   }
    // });

    /*
        1 is emitted for left mouse click
        2 is emitted form right mouse click
        3 is emitted for wheel mouse click
        1 is emitted when wheel is scrolled down
       -1 is emitted when wheel is scrolled up
    */
    const leftButtonId  = 1
    const rightButtonId = 2
    const wheelButtonId = 3
    const scrollDownId  = 1
    const scrollUpId   = -1
    /*
      new event listeners using iohook
    */
    ioHook.on('mousedown', event => {
      if(recorder.recordingStarted){
        if(event.button === leftButtonId){
          recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer, "left_click"]
        }
        if(event.button === rightButtonId){
          recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer, "right_click"]
        }
        if(event.button === wheelButtonId){
          recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer, "wheel_click"]
        }
        
        console.log("click registered ==>",recorder.currentTimer);
      }
    });
    
    ioHook.on('mouseup', event => {
      if(recorder.recordingStarted){
        
        if(event.button === leftButtonId){
          recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer, "left_release"]
        }
        if(event.button === rightButtonId){
          recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer, "right_release"]
        }
        if(event.button === wheelButtonId){
          recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer, "wheel_release"]
        }
        
        console.log("release registered ==>",recorder.currentTimer);
      }
    });
    
    ioHook.on('mousewheel', event => {
      if(recorder.recordingStarted){
        if(event.rotation === scrollDownId){
          recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer, "scroll_down"]
        } 
        if(event.rotation === scrollUpId){
          recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer, "scroll_up"]
        }
        console.log("mousewheel registered ==>",recorder.currentTimer);
      }
    });
    
    
    ioHook.on('keydown', event => {
      if(recorder.recordingStarted){
        recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer, event.type, event]
        console.log("keyboard key clicked ==>",recorder.currentTimer);
      }
    });
    
    ioHook.on('keyup', event => {
      // console.log(event)
      if(recorder.recordingStarted){
        
        recorder.clickEventDetails = [event.x, event.y, recorder.currentTimer, event.type, event]
        console.log("keyboard key released ==>",recorder.currentTimer);
      }
    });

  }, [recorder]);

  const stopRecord = useCallback(() => {
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    remote.globalShortcut.unregister("F10");
    recorder.stop();
    // setRecording(false);
    onFinish();
  }, [recorder, onFinish]);

  const startRecord = useCallback(() => {
    // eslint-disable-next-line global-require
    const { remote, desktopCapturer } = require("electron");
    setCount(-1);
    setRecording(true);

    desktopCapturer
      .getSources({
        types: ["window", "screen"],
      })
      .then((all) => {
        const s = all.filter((c) => c.name == currentSource)[0] || sources[0];
        recorder.start(s);
      });

    remote.globalShortcut.register("F10", stopRecord);
  }, [sources, recorder]);

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
