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
import ButtonRound from "../../button-round";

import { ReactComponent as IconAdd } from "../../../../assets/svg/add.svg";
import usePopupImageSource from "../../../hooks/usePopupImageSource";
import newAnchor from "../lesson-utils/newAnchor";
import ModalList from "../modal-list";
import updateItem from "../lesson-utils/updateItem";
import SettingsFocusHighlight from "./settings-focus-highlight";
import SettingsImage from "./settings-image";

interface OpenItemProps {
  id: string;
}

type ItemModalOptions = "Settings" | "Anchor" | "Trigger";
const itemModalOptions: ItemModalOptions[] = ["Settings", "Anchor", "Trigger"];

export default function OpenItem(props: OpenItemProps) {
  const dispatch = useDispatch();
  const { treeItems, treeAnchors, currentAnchor } = useSelector(
    (state: AppState) => state.createLessonV2
  );
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

  const callback = useCallback(
    (e) => {
      newAnchor(
        {
          name: "New Anchor",
          type: "crop",
          templates: [e],
          anchorFunction: "or",
          cvMatchValue: 0,
          cvCanvas: 50,
          cvDelay: 100,
          cvGrayscale: true,
          cvApplyThreshold: false,
          cvThreshold: 127,
        },
        id
      );
    },
    [id]
  );

  const openAnchor = useCallback(
    (e) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { currentAnchor: e },
      });
    },
    [id]
  );

  const [Popup, open] = usePopupImageSource(callback, true, true, true);

  return (
    <>
      {Popup}
      <Tabs
        buttons={itemModalOptions}
        initial={view}
        callback={setView}
        style={{ width: "-webkit-fill-available", height: "42px" }}
      />
      <TabsContainer style={{ height: "200px", overflow: "auto" }}>
        {view === "Settings" && item.type == "focus_highlight" && (
          <SettingsFocusHighlight item={item} update={doUpdate} />
        )}
        {view === "Settings" && item.type == "image" && (
          <SettingsImage item={item} update={doUpdate} />
        )}
        {view === "Anchor" && (
          <>
            <Flex
              column
              style={{ height: "calc(100% - 24px)", overflow: "auto" }}
            >
              <ModalList
                options={Object.keys(treeAnchors).map((a) => treeAnchors[a])}
                current={item?.anchor || ""}
                selected={currentAnchor || ""}
                setCurrent={(val) => doUpdate({ anchor: val })}
                open={openAnchor}
              />
            </Flex>
            <div>
              <ButtonRound
                width="24px"
                height="24px"
                svg={IconAdd}
                svgStyle={{ width: "16px", height: "16px" }}
                onClick={open}
              />
            </div>
          </>
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
