import React, { useCallback } from "react";
import "./imageFound.scss";
import { BasePanelViewProps } from "../viewTypes";
import ContainerWithCheck from "../../../container-with-check";
import {
  MouseLeftTriggerTypeValue,
  MouseDoubleTriggerTypeValue,
  MouseHoverTriggerTypeValue,
} from "../../../../items/endStep";

type MouseTriggers =
  | MouseLeftTriggerTypeValue
  | MouseDoubleTriggerTypeValue
  | MouseHoverTriggerTypeValue;

export function TriggerMouseList(props: BasePanelViewProps<MouseTriggers>) {
  const { select, data, open } = props;

  const doCheckToggle = useCallback(
    (val: boolean, k: MouseTriggers["value"]) => {
      select(k as any, val ? "" : null);
    },
    [select]
  );

  const typeToText: Record<MouseTriggers["type"], string> = {
    "mouse-left": "Left Click",
    "mouse-double": "Double Click",
    "mouse-hover": "On Hover",
  };

  return (
    <>
      {Object.keys(typeToText).map((k: any) => (
        <ContainerWithCheck
          key={`hover-option-${k}`}
          checked={data.filter((d) => d.type == k).length > 0}
          callback={(val) => doCheckToggle(val, k)}
        >
          <div
            style={{ width: "200px", height: "120px" }}
            onClick={() => open(k)}
          >
            {typeToText[k as MouseTriggers["type"]]}
          </div>
        </ContainerWithCheck>
      ))}
    </>
  );
}

export function TriggerMouseView(
  props: BasePanelViewProps<MouseTriggers> & {
    id: string;
  }
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, data, select } = props;

  return <></>;
}
