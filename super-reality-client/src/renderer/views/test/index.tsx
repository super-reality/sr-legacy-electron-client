import React, { useCallback, useRef } from "react";
import "./index.scss";
import ButtonSimple from "../../components/button-simple";
import createLessonInterface from "../../../utils/createLessonInterface";
import getFace from "../../../utils/getFace";
import ipcSend from "../../../utils/ipcSend";

export default function Test(): JSX.Element {
  const onCLose = useCallback(() => console.log("Closed!"), []);
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const onClick = useCallback(() => {
    createLessonInterface({}).then(onCLose);
  }, []);

  const testFace = useCallback(() => {
    if (imageInput.current && videoInput.current) {
      getFace(imageInput.current, videoInput.current);
    }
  }, [imageInput, videoInput]);
  const pythonTest = useCallback(() => {
    ipcSend({
      method: "pythonExec",
      arg: ["Test", "Argument"],
      to: "background",
    });
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
        margin="16px auto"
        onClick={testFace}
      >
        Test Face Thingy
      </ButtonSimple>
      Select Image
      <input ref={imageInput} type="file" accept="image/*" />
      Select Video
      <input ref={videoInput} type="file" accept="video/*" />
    </div>
  );
}
