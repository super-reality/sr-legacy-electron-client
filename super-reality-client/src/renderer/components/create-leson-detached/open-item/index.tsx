import React, { useCallback, useState } from "react";

import { ReactComponent as ItemArea } from "../../../../assets/svg/item-area.svg";
import { ReactComponent as ItemAnchor } from "../../../../assets/svg/item-anchor.svg";
import { ReactComponent as ItemTrigger } from "../../../../assets/svg/item-trigger.svg";
import globalData from "../../../globalData";
import {
  ItemFocusTriggers,
  ItemAudioTriggers,
  ItemImageTriggers,
  ItemVideoTriggers,
  ItemDialogTriggers,
  Item,
} from "../../../api/types/item/item";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import ModalButtons from "../modal-buttons";
import Flex from "../../flex";

interface OpenItemProps {
  id: string;
}

type ItemModalOptions = "settings" | "anchors" | "trigger";
const itemModalOptions: ItemModalOptions[] = ["settings", "anchors", "trigger"];

export default function OpenItem(props: OpenItemProps) {
  const [view, setView] = useState<ItemModalOptions>(itemModalOptions[0]);
  const { id } = props;

  const item: Item | null = globalData.items[id] || null;
  let triggers: Record<string, number | null> = { None: null };
  if (item) {
    switch (item.type) {
      case "focus_highlight":
        triggers = ItemFocusTriggers;
        break;
      case "audio":
        triggers = ItemAudioTriggers;
        break;
      case "image":
        triggers = ItemImageTriggers;
        break;
      case "video":
        triggers = ItemVideoTriggers;
        break;
      case "dialog":
        triggers = ItemDialogTriggers;
        break;
      default:
        break;
    }
  }

  const setTrigger = useCallback((value: number | null) => {
    globalData.items[id].trigger = value;
  }, []);

  return (
    <Flex
      column
      style={{
        width: "auto",
        height: "200px",
        borderRadius: "4px",
      }}
    >
      <ModalButtons
        buttons={itemModalOptions}
        initial={view}
        callback={setView}
        style={{ width: "-webkit-fill-available", height: "41px" }}
        icons={[ItemArea, ItemAnchor, ItemTrigger]}
      />
      <Flex style={{ height: "calc(100% - 41px)", overflow: "auto" }}>
        {view === "settings" && <Flex column />}
        {view === "anchors" && <Flex column />}
        {view === "trigger" && (
          <Flex column style={{ width: "-webkit-fill-available" }}>
            <BaseSelect
              title="Trigger"
              current={item.trigger}
              options={Object.values(triggers)}
              optionFormatter={constantFormat(triggers)}
              callback={setTrigger}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
