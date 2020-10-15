import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactComponent as RecordIcon } from "../../../../assets/svg/record.svg";
import { captureDesktopStream } from "../../../../utils/capture";
import ButtonRound from "../../button-round";
import Flex from "../../flex";
import ReactSelect from "../../top-select";
import Windowlet from "../windowlet";
import CVRecorder from "./CVRecorder";

interface RecorderProps {
  onFinish: () => void;
}

export default function Recorder(props: RecorderProps): JSX.Element {
  const { onFinish } = props;
  const [count, setCount] = useState(-1);
  const [recording, setRecording] = useState(false);
  const [sources, setSources] = useState<Record<string, any>>({});
  const [currentSource, setCurrentSource] = useState<any>({
    name: "Entire Screen",
  });

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
  }, []);

  const stopRecord = useCallback(() => {
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    remote.globalShortcut.unregister("F10");
    recorder.stop();
    // setRecording(false);
    onFinish();
  }, [recorder, onFinish]);

  const startRecord = useCallback(() => {
    setCount(-1);
    setRecording(true);
    captureDesktopStream(sources).then(recorder.start).catch(stopRecord);

    // eslint-disable-next-line global-require
    const { remote } = require("electron");
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
                current={currentSource.name}
                callback={(name) => {
                  setCurrentSource(sources[name]);
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
