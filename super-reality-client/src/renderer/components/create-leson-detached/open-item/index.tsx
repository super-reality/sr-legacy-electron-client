import React, { useCallback, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  ItemFocusTriggers,
  ItemAudioTriggers,
  ItemImageTriggers,
  ItemVideoTriggers,
  ItemDialogTriggers,
  ItemFXTriggers,
  Item,
} from "../../../api/types/item/item";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import Flex from "../../flex";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { TabsContainer } from "../../tabs";
import updateItem from "../lesson-utils/updateItem";
import SettingsFocusHighlight from "./settings-focus-highlight";
import SettingsImage from "./settings-image";
import BaseToggle from "../../base-toggle";
import FXSettings from "./settings-fx";
import SettingsDialog from "./settings-dialog";

// import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";

// New  Settings Style
// import ItemSettingsContainer from "./settings-container";
import "./settings-fx/settings-fx.scss";

interface OpenItemProps {
  id: string;
}

export default function OpenItem(props: OpenItemProps) {
  const dispatch = useDispatch();
  const { treeItems } = useSelector((state: AppState) => state.createLessonV2);
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
      case "fx":
        triggers = ItemFXTriggers;
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

  // const openParentAnchor = useCallback(() => {
  //   const step = treeSteps[currentStep || ""];
  //   if (step && step.anchor) {
  //     reduxAction(dispatch, {
  //       type: "CREATE_LESSON_V2_DATA",
  //       arg: { currentAnchor: step.anchor },
  //     });
  //   }
  // }, [dispatch, treeSteps, currentStep]);

  // anchors tree
  // const anchorsList = Object.keys(treeAnchors).map((a) => treeAnchors[a].name);

  if (!item) return <></>;
  // console.log(item.anchor);
  // console.log(Object.values(treeAnchors));
  // const anchorPreview = useCallback(() => {}, []);
  return (
    <>
      <TabsContainer
        style={{
          padding: "10px",
          margin: "0 3px",
          height: "200px",
          overflow: "auto",
          background: "#2e2a48",
        }}
      >
        <Flex column>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <BaseToggle
              title="Use Anchor"
              value={item.anchor}
              callback={(val) => {
                doUpdate({ anchor: val });
              }}
            />
          </div>
          <BaseSelect
            title="Trigger"
            current={item.trigger}
            options={Object.values(triggers)}
            optionFormatter={constantFormat(triggers)}
            callback={(val) => doUpdate({ trigger: val })}
          />
        </Flex>

        {item.type == "focus_highlight" && (
          <SettingsFocusHighlight item={item} update={doUpdate} />
        )}
        {item.type == "image" && (
          <SettingsImage item={item} update={doUpdate} />
        )}
        {item.type == "dialog" && (
          <SettingsDialog item={item} update={doUpdate} />
        )}
        {item.type == "fx" && <FXSettings />}
      </TabsContainer>
    </>
  );
}
