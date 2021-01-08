import React, { PropsWithChildren, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { ReactComponent as CloseIcon } from "../../../../assets/svg/close.svg";
import reduxAction from "../../../redux/reduxAction";

export default function useBasePanel(
  title: string
): (props: PropsWithChildren<unknown>) => JSX.Element {
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

  const Component = useMemo(
    () => (props: PropsWithChildren<unknown>) => (
      <div className="selector-panel-container">
        <div className="panel-title">
          <div>{title}</div>
          <CloseIcon
            style={{
              width: "16px",
              height: "16px",
              cursor: "pointer",
            }}
            stroke="var(--color-icon)"
            onClick={() => openPanel("")}
          />
        </div>
        <div className="panels-flex">{props.children}</div>
      </div>
    ),

    [title]
  );

  return Component;
}
