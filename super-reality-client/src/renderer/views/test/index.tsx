import React, { useCallback } from "react";
import "./index.scss";
import ButtonSimple from "../../components/button-simple";
import createLessonInterface from "../../../utils/createLessonInterface";

export default function Test(): JSX.Element {
  const onCLose = useCallback(() => console.log("Closed!"), []);

  const onClick = useCallback(() => {
    createLessonInterface({}).then(onCLose);
  }, []);

  return (
    <div className="mid">
      <ButtonSimple width="200px" height="24px" margin="auto" onClick={onClick}>
        Click me!
      </ButtonSimple>
    </div>
  );
}
