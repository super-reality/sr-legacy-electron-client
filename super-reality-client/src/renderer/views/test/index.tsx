import React, { useCallback } from "react";
import "./index.scss";
import ButtonSimple from "../../components/button-simple";
import createLessonInterface from "../../../utils/createLessonInterface";
import ipcSend from "../../../utils/ipcSend";
import { IpcMsgUrlByTitleResponse } from "../../../types/ipc";
import { makeIpcListenerOnce } from "../../../utils/handleIpc";

export default function Test(): JSX.Element {
  const onCLose = useCallback(() => console.log("Closed!"), []);

  const onClick = useCallback(() => {
    createLessonInterface({}).then(onCLose);
  }, []);

  const pythonTest = useCallback(() => {
    ipcSend({
      method: "pythonExec",
      arg: ["Test", "Argument"],
      to: "background",
    });
  }, []);

  const duckduckgoTest = useCallback(() => {
    ipcSend({
      method: "getUrlbyTitle",
      arg: "puppeteer-in-electron - npm",
    });
    makeIpcListenerOnce<IpcMsgUrlByTitleResponse>("getUrlbyTitleResponse").then(
      (arg) => {
        console.log("getUrlbyTitleResponse: ", arg);
      }
    );
  }, []);

  return (
    <div className="mid">
      <ButtonSimple width="200px" height="24px" margin="auto" onClick={onClick}>
        Click me!
      </ButtonSimple>

      <ButtonSimple
        width="200px"
        height="24px"
        margin="auto"
        onClick={pythonTest}
      >
        Test python background
      </ButtonSimple>

      <ButtonSimple
        width="200px"
        height="24px"
        margin="auto"
        onClick={duckduckgoTest}
      >
        Test duckduckgo
      </ButtonSimple>
    </div>
  );
}
