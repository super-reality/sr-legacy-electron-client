import React, { useCallback, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Item } from "../../../items/item";
import Flex from "../../flex";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { TabsContainer } from "../../tabs";
import updateItem from "../lesson-utils/updateItem";
import BaseToggle from "../../base-toggle";

import { ReactComponent as IconEndStep } from "../../../../assets/svg/start-step.svg"; // Should have end step icon

import getItemSettings from "../../../items/getItemSettings";
import ButtonSimple from "../../button-simple";

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

  const doUpdate = useCallback(
    <T extends Item>(data: Partial<T>) => {
      const updatedItem = { ...treeItems[id], ...data };
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_SETITEM",
        arg: { item: updatedItem },
      });
      updateItem<T>(updatedItem, id);
    },
    [id, treeItems]
  );

  const openPanel = useCallback(
    (panel: string) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { openPanel: panel },
      });
    },
    [dispatch]
  );

  if (!item) return <></>;

  const ItemSettings = getItemSettings(item);

  const style = {
    padding: "0px 15px",
    background: "#2e2a48",
    margin: "3.5px 0",
    width: "90%",
    height: "40px",
    justifyContent: "left",
    color: "#8A88C3",
  };

  return (
    <>
      <TabsContainer
        style={{
          padding: "10px 5px",
          margin: "0 3px",
          overflow: "auto",
        }}
      >
        <Flex column>
          <BaseToggle
            title="Use Anchor"
            value={item.anchor}
            callback={(val) => {
              doUpdate({ anchor: val });
            }}
          />
          <ButtonSimple style={style} onClick={() => openPanel("end-step-on")}>
            <IconEndStep />
            End Step On
          </ButtonSimple>
        </Flex>

        {ItemSettings && <ItemSettings item={item} update={doUpdate} />}
      </TabsContainer>
    </>
  );
}
