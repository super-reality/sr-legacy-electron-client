import React, { useCallback, useMemo, useState } from "react";

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
import { Tabs, TabsContainer } from "../../tabs";
import updateItem from "../lesson-utils/updateItem";
import SettingsFocusHighlight from "./settings-focus-highlight";
import SettingsImage from "./settings-image";
import BaseToggle from "../../base-toggle";
import FXSettings from "./settings-fx/settings-fx";
import SettingsDialog from "./settings-dialog";
import ButtonRound from "../../button-round";

import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";

// New  Settings Style
import ItemSettingsContainer from "./settings-container";
import "./settings-fx/settings-fx.scss";

interface OpenItemProps {
  id: string;
}

type ItemModalOptions = "Settings" | "Trigger";
const itemModalOptions: ItemModalOptions[] = ["Settings", "Trigger"];

export default function OpenItem(props: OpenItemProps) {
  const dispatch = useDispatch();
  const { treeItems, treeSteps, treeAnchors, currentStep } = useSelector(
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

  const openParentAnchor = useCallback(() => {
    const step = treeSteps[currentStep || ""];
    if (step && step.anchor) {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { currentAnchor: step.anchor },
      });
    }
  }, [dispatch, treeSteps, currentStep]);

  // anchors tree
  const anchorsList = Object.keys(treeAnchors).map((a) => treeAnchors[a].name);

  if (!item) return <></>;
  // console.log(item.anchor);
  // console.log(Object.values(treeAnchors));
  const anchorPreview = useCallback(() => {}, []);
  return (
    <>
      {view === "Settings" && item.type == "fx" ? (
        <ItemSettingsContainer>
          <FXSettings item={item} update={doUpdate} />
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

          {/* <BaseSelect
            title="Computer Vision"
            current="choose the anchor"
            options={anchorsList}
            // optionFormatter={Object.keys(treeAnchors).map(
            //   (a) => treeAnchors[a]
            // )}
            callback={() => {}}
          /> */}

          {/* <div className="anchor-preview">
            <img src="https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1605844330340.png" />
          </div> */}
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <BaseSelect
              title="Trigger"
              current={item.trigger}
              options={Object.values(triggers)}
              optionFormatter={constantFormat(triggers)}
              callback={(val) => doUpdate({ trigger: val })}
            />
          </div>
        </ItemSettingsContainer>
      ) : (
        <>
          <Tabs
            buttons={itemModalOptions}
            initial={view}
            callback={setView}
            style={{ width: "-webkit-fill-available", height: "42px" }}
          />
          <TabsContainer
            style={{ minHeight: "270px", height: "400px", overflow: "auto" }}
          >
            {view === "Settings" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px auto",
                  gap: "8px",
                }}
              >
                <ButtonRound
                  width="32px"
                  height="32px"
                  svg={AnchorIcon}
                  onClick={openParentAnchor}
                />
                <BaseToggle
                  title="Use Anchor"
                  value={item.anchor}
                  callback={(val) => {
                    doUpdate({ anchor: val });
                  }}
                />
              </div>
            )}
            {view === "Settings" && item.type == "focus_highlight" && (
              <SettingsFocusHighlight item={item} update={doUpdate} />
            )}
            {view === "Settings" && item.type == "image" && (
              <SettingsImage item={item} update={doUpdate} />
            )}
            {view === "Settings" && item.type == "dialog" && (
              <SettingsDialog item={item} update={doUpdate} />
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
      )}
    </>
  );
}
