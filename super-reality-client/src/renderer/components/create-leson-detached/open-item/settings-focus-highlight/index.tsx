import React from "react";
import { ItemFocus } from "../../../../api/types/item/item";
import ButtonSimple from "../../../button-simple";
import Flex from "../../../flex";
import "../../../lesson-player/find-box/index.scss";

interface SettingsFocusHighlight {
  item: ItemFocus;
  update: (date: Partial<ItemFocus>) => void;
}

export default function SettingsFocusHighlight(props: SettingsFocusHighlight) {
  const { item, update } = props;

  const styleSelected = { backgroundColor: "var(--color-background)" };

  return (
    <Flex style={{ justifyContent: "space-between" }}>
      <ButtonSimple
        width="48px"
        height="48px"
        style={item.focus == "Area highlight" ? styleSelected : {}}
        onClick={() => update({ focus: "Area highlight" })}
      >
        <div className="example-box area" />
      </ButtonSimple>
      <ButtonSimple
        width="48px"
        height="48px"
        style={item.focus == "Mouse Point" ? styleSelected : {}}
        onClick={() => update({ focus: "Mouse Point" })}
      >
        <div className="example-box mouse" />
      </ButtonSimple>
      <ButtonSimple
        width="48px"
        height="48px"
        style={item.focus == "Rectangle" ? styleSelected : {}}
        onClick={() => update({ focus: "Rectangle" })}
      >
        <div className="example-box rectangle" />
      </ButtonSimple>
    </Flex>
  );
}
