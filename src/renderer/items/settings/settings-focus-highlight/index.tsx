import { ItemFocus } from "../../item";
import ButtonSimple from "../../../components/button-simple";
import Flex from "../../../components/flex";
import "../../boxes/find-box/index.scss";
import { BaseSettingsProps } from "../settings";

export default function SettingsFocusHighlight(
  props: BaseSettingsProps<ItemFocus>
) {
  const { item, update } = props;

  const styleSelected = { backgroundColor: "var(--color-background)" };

  return (
    <Flex style={{ justifyContent: "space-between" }}>
      <ButtonSimple
        width="56px"
        height="56px"
        style={item.focus == "Area highlight" ? styleSelected : {}}
        onClick={() => update({ focus: "Area highlight" })}
      >
        <div className="example-box area" />
      </ButtonSimple>
      <ButtonSimple
        width="56px"
        height="56px"
        style={item.focus == "Mouse Point" ? styleSelected : {}}
        onClick={() => update({ focus: "Mouse Point" })}
      >
        <div className="example-box mouse" />
      </ButtonSimple>
      <ButtonSimple
        width="56px"
        height="56px"
        style={item.focus == "Rectangle" ? styleSelected : {}}
        onClick={() => update({ focus: "Rectangle" })}
      >
        <div className="example-box rectangle" />
      </ButtonSimple>
    </Flex>
  );
}
