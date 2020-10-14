import React, { useCallback, useState } from "react";

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

interface OpenItemProps {
  id: string;
}

type ItemModalOptions = "Settings" | "Anchor" | "Trigger";
const itemModalOptions: ItemModalOptions[] = ["Settings", "Anchor", "Trigger"];

export default function OpenItem(props: OpenItemProps) {
  const dispatch = useDispatch();
  const { treeItems, treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const [view, setView] = useState<ItemModalOptions>(itemModalOptions[0]);
  const { id } = props;

  const item: Item | null = treeItems[id] || null;
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

  const setTrigger = useCallback(
    (value: number | null) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_SETITEM",
        arg: { item: { ...treeItems[id], trigger: value } },
      });
    },
    [id, dispatch]
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
        {view === "Settings" && <Flex column />}
        {view === "Anchor" && (
          <Flex column style={{ width: "-webkit-fill-available" }}>
            <div>
              {Object.keys(treeAnchors).map((aid) => {
                const anchor = treeAnchors[aid];
                return (
                  <div key={`anchor-list-${anchor._id}`}>{anchor.name}</div>
                );
              })}
            </div>
            <div>
              <ButtonRound
                width="24px"
                height="24px"
                svg={IconAdd}
                svgStyle={{ width: "16px", height: "16px" }}
                onClick={open}
              />
            </div>
          </Flex>
        )}
        {view === "Trigger" && (
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
      </TabsContainer>
    </>
  );
}
