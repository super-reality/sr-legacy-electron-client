import React, { useCallback } from "react";
import "./index.scss";
import ButtonSimple from "../../components/button-simple";
import createLessonInterface from "../../../utils/createLessonInterface";
import globalData from "../../globalData";

export default function Test(): JSX.Element {
  const onCLose = useCallback(() => console.log("Closed!"), []);

  const onClick = useCallback(() => {
    createLessonInterface({}).then(onCLose);
  }, []);

  const pythonTest = useCallback(() => {
    console.log(globalData.backgroundProcess.webContents);
    globalData.backgroundProcess.webContents.send("pythonExec", [
      "Test",
      "Argument",
    ]);
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
    </div>
  );
}
