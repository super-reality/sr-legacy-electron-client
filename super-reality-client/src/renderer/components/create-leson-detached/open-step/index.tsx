import React, { useCallback } from "react";

import { useDispatch } from "react-redux";
import reduxAction from "../../../redux/reduxAction";
import ButtonSimple from "../../button-simple";

export default function OpenStep() {
  const dispatch = useDispatch();

  const openPanel = useCallback(
    (panel: string) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { openPanel: panel },
      });
    },
    [dispatch]
  );

  return (
    <>
      <ButtonSimple
        margin="4px auto"
        style={{ padding: 0 }}
        width="270px"
        height="40px"
        onClick={() => openPanel("step-information")}
      >
        Information
      </ButtonSimple>
      <ButtonSimple
        margin="4px auto"
        style={{ padding: 0 }}
        width="270px"
        height="40px"
        onClick={() => openPanel("start-step")}
      >
        Start Step
      </ButtonSimple>
      <ButtonSimple
        margin="4px auto"
        style={{ padding: 0 }}
        width="270px"
        height="40px"
        onClick={() => openPanel("step-canvas")}
      >
        Canvas
      </ButtonSimple>
      <ButtonSimple
        margin="4px auto"
        style={{ padding: 0 }}
        width="270px"
        height="40px"
        onClick={() => openPanel("step-skills")}
      >
        Skills and achievements
      </ButtonSimple>
      <ButtonSimple
        margin="4px auto"
        style={{ padding: 0 }}
        width="270px"
        height="40px"
        onClick={() => openPanel("step-alerts")}
      >
        Alerts
      </ButtonSimple>
    </>
  );
}
