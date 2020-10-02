import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as RecordIcon } from "../../../../assets/svg/record.svg";
import ButtonRound from "../../button-round";
import Flex from "../../flex";
import ReactSelect from "../../top-select";
import Windowlet from "../windowlet";

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
    // setRecording(false);
    onFinish();
  }, [onFinish]);

  const startRecord = useCallback(() => {
    setCount(-1);
    setRecording(true);
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    remote.globalShortcut.register("F10", stopRecord);
  }, []);

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
        <div
          style={{
            fontSize: "20px",
            minWidth: "400px",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            borderRadius: "10px",
            padding: "16px",
            margin: "16px auto auto auto",
            color: "var(--color-red)",
            fontWeight: 500,
          }}
        >{`Recording will start in ${count} seconds`}</div>
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
            <Flex style={{ margin: "auto auto 4px auto" }}>
              <RecordIcon
                style={{ cursor: "pointer", marginRight: "16px" }}
                width="64px"
                height="64px"
                onClick={() => setCount(3)}
              />
              <ReactSelect
                style={{ width: "200px" }}
                options={Object.keys(sources)}
                current={currentSource.name}
                callback={(name) => {
                  setCurrentSource(sources[name]);
                }}
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
