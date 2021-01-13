import React, { useCallback, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Item } from "../../../items/item";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import Flex from "../../flex";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { TabsContainer } from "../../tabs";
import updateItem from "../lesson-utils/updateItem";
import BaseToggle from "../../base-toggle";

import getItemTriggers from "../../../items/getitemTriggers";
import getItemSettings from "../../../items/getItemSettings";

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

  const triggers = getItemTriggers(item);

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

  if (!item) return <></>;

  const ItemSettings = getItemSettings(item);

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
          <BaseSelect
            title="Trigger"
            current={item.trigger}
            options={Object.values(triggers)}
            optionFormatter={constantFormat(triggers)}
            callback={(val) => doUpdate({ trigger: val })}
          />
        </Flex>

        {ItemSettings && <ItemSettings item={item} update={doUpdate} />}
      </TabsContainer>
    </>
  );
}
