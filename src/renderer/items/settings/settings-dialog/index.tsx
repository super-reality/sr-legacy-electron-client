import { useCallback, useEffect, useState } from "react";
import { ItemDialog } from "../../item";
import useDebounce from "../../../hooks/useDebounce";
import BaseTextArea from "../../../components/base-textarea";
import "../../boxes/find-box/index.scss";
import { BaseSettingsProps } from "../settings";

export default function SettingsDialog(props: BaseSettingsProps<ItemDialog>) {
  const { item, update } = props;
  const [text, setText] = useState(item.text);

  useEffect(() => {
    setText(item.text);
  }, [item.text]);

  const debouncer = useDebounce(1000);

  const debouncedUpdate = useCallback(
    (data: Partial<ItemDialog>) => {
      debouncer(() => {
        update(data);
      });
    },
    [debouncer, update]
  );

  return (
    <BaseTextArea
      title=""
      value={text}
      onChange={(e) => {
        setText(e.currentTarget.value);
        debouncedUpdate({ text: e.currentTarget.value });
      }}
    />
  );
}
