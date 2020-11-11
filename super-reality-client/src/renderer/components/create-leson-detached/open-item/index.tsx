import React, { useCallback, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
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
import Flex from "../../flex";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { Tabs, TabsContainer } from "../../tabs";
import updateItem from "../lesson-utils/updateItem";
import SettingsFocusHighlight from "./settings-focus-highlight";
import SettingsImage from "./settings-image";
import BaseToggle from "../../base-toggle";

interface OpenItemProps {
  id: string;
}

type ItemModalOptions = "Settings" | "Trigger";
const itemModalOptions: ItemModalOptions[] = ["Settings", "Trigger"];

export default function OpenItem(props: OpenItemProps) {
  const dispatch = useDispatch();
  const { treeItems } = useSelector((state: AppState) => state.createLessonV2);
  const [view, setView] = useState<ItemModalOptions>(itemModalOptions[0]);
  const { id } = props;

  const item: Item | null = useMemo(() => treeItems[id] || null, [
    id,
    treeItems,
  ]);

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

  const doUpdate = useCallback(
    <T extends Item>(data: Partial<T>) => {
      const updatedItem = { ...treeItems[id], ...data };
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_SETITEM",
        arg: { item: updatedItem },
      });
      updateItem(updatedItem, id);
    },
    [id, treeItems]
  );

  if (!item) return <></>;

  return (
    <>
      <Tabs
        buttons={itemModalOptions}
        initial={view}
        callback={setView}
        style={{ width: "-webkit-fill-available", height: "42px" }}
      />
      <TabsContainer style={{ height: "200px", overflow: "auto" }}>
        {view === "Settings" && (
          <BaseToggle
            title="Use Anchor"
            value={item.anchor}
            callback={(val) => {
              doUpdate({ anchor: val });
            }}
          />
        )}
        {view === "Settings" && item.type == "focus_highlight" && (
          <SettingsFocusHighlight item={item} update={doUpdate} />
        )}
        {view === "Settings" && item.type == "image" && (
          <SettingsImage item={item} update={doUpdate} />
        )}
        {view === "Trigger" && (
          <Flex column style={{ width: "-webkit-fill-available" }}>
            <BaseSelect
              title="Trigger"
              current={item.trigger}
              options={Object.values(triggers)}
              optionFormatter={constantFormat(triggers)}
              callback={(val) => doUpdate({ trigger: val })}
            />
          </Flex>
        )}
      </TabsContainer>
    </>
  );
}
