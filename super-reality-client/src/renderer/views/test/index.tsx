import React, { useCallback } from "react";
import "./index.scss";
import ButtonSimple from "../../components/button-simple";
import createLessonInterface from "../../../utils/createLessonInterface";
import getFace from "../../../utils/getFace";

export default function Test(): JSX.Element {
  const onCLose = useCallback(() => console.log("Closed!"), []);

  const onClick = useCallback(() => {
    createLessonInterface({}).then(onCLose);
  }, []);

  const testFace = useCallback(() => {
    getFace(
      "C:/Users/Manuh/Desktop/arnold.jpg",
      "C:/Users/Manuh/Desktop/speakingtocamera.mp4"
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
        margin="16px auto"
        onClick={testFace}
      >
        Test Face Thingy
      </ButtonSimple>
    </div>
  );
}
