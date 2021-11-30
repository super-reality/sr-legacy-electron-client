import { useCallback, useState } from "react";
import { BasePanelViewProps } from "../viewTypes";
import BaseToggle from "../../../base-toggle";
import BaseTextArea from "../../../base-textarea";

export interface TextFoundTypeValue {
  type: "Text Found";
  value: string;
}

export function TextFoundList(props: BasePanelViewProps<TextFoundTypeValue>) {
  const { select, data } = props;

  const filterFn = () => data.filter((d) => d.type == "Text Found")[0];
  const filterFnCheck = () => !!filterFn();

  const [value, setValue] = useState(filterFn()?.value || "");

  const toggleCheck = useCallback(
    (val: boolean) => {
      if (!val) {
        select("Text Found", null);
      } else {
        select("Text Found", value);
      }
    },
    [select, value]
  );

  return (
    <>
      <BaseToggle
        title="Enable"
        value={filterFnCheck()}
        callback={(v) => toggleCheck(v)}
      />
      <BaseTextArea
        title="Text"
        value={value}
        onChange={(e: any) => {
          setValue(e.target.value);
          if (filterFnCheck()) {
            select("Text Found", e.target.value);
          }
        }}
      />
    </>
  );
}
