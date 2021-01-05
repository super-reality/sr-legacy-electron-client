import React, { useCallback } from "react";
import "./index.scss";
import { useDispatch } from "react-redux";
import ButtonSimple from "../../components/button-simple";
import ipcSend from "../../../utils/ipcSend";
import { MODE_LESSON_CREATOR } from "../../redux/slices/renderSlice";
import setAppMode from "../../redux/utils/setAppMode";

export default function Test(): JSX.Element {
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    setAppMode(MODE_LESSON_CREATOR);
  }, [dispatch]);

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
    </div>
  );
}
