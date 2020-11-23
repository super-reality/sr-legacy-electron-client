import React, { useCallback, useEffect, useState } from "react";
import { ItemDialog } from "../../../../api/types/item/item";
import useDebounce from "../../../../hooks/useDebounce";
import BaseTextArea from "../../../base-textarea";
import "../../../lesson-player/find-box/index.scss";

interface SettingsDialog {
  item: ItemDialog;
  update: (date: Partial<ItemDialog>) => void;
}

export default function SettingsDialog(props: SettingsDialog) {
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
      title="Text"
      value={text}
      onChange={(e) => {
        setText(e.currentTarget.value);
        debouncedUpdate({ text: e.currentTarget.value });
      }}
    />
  );
}
