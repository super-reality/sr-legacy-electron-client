import React, { CSSProperties, useCallback, useMemo, useState } from "react";

import "./settings-fx.scss";

import { useDispatch, useSelector } from "react-redux";
import Flex from "../../../flex";
import { AppState } from "../../../../redux/stores/renderer";
import reduxAction from "../../../../redux/reduxAction";

import { ReactComponent as IconTreeDropArrow } from "../../../../../assets/svg/tree-drop.svg";
import IconStars from "../../../../../assets/images/stars-icon.png";
import IconFireworks from "../../../../../assets/images/fireworks-icon.png";
import IconCoins from "../../../../../assets/images/coins-icon.png";
import { ItemFX, FX } from "../../../../api/types/item/item";
import ButtonSimple from "../../../button-simple";

const TestFXItems = [
  {
    id: "1",
    name: "Great Success",
    effect: "id_1",
    subitems: [
      {
        id: "id_1",
        name: "Stars",
        icon: IconStars,
        effect: "id_1",
      },
      {
        id: "id_2",
        name: "Fireworks",
        icon: IconFireworks,
        effect: "id_1",
      },
      {
        id: "id_3",
        name: "Coins",
        icon: IconCoins,
        effect: "id_1",
      },
    ],
  },
];

interface SettingsFX {
  name: ItemFX;

  // update: (date: Partial<ItemFX>) => void;
}

interface FXSettingsProps {
  style?: CSSProperties;
  item?: any;
  update: (date: Partial<ItemFX>) => void;
}

export default function FXSettings(props: FXSettingsProps): JSX.Element {
  const { item, update, style } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [effect, setEffect] = useState("id_1");

  const openFolder = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      setOpen(!open);
    },
    [open]
  );
  return (
    <Flex style={{ backgroundColor: "var(--color-background)" }}>
      <div className="settings-list">
        <div className="settings-list-item">
          <div
            className="settings-list-item-header"
            style={{}}
            onClick={openFolder}
          >
            <div className={`folder-drop ${open ? "open" : ""}`}>
              <IconTreeDropArrow
                style={{ margin: "auto" }}
                fill="var(--color-icon)"
              />
            </div>

            <div className="title">Effects</div>
          </div>
          <div className="settings-list-item-list">
            <button
              type="button"
              className={`settings-list-item-list-subitem subitem-container${
                item.effect == "id_1" ? "-selected" : ""
              }`}
              onClick={() => {
                setEffect("id_1");
                update({ effect: "id_1" });
              }}
            >
              {/* <img
                src={IconStars}
                alt="icon-stars"
                className="settings-subitem-icon"
              /> */}
              <embed
                src="../fx/rainbow-circle-wavy-big/"
                width="40"
                height="40"
              />
              <div className="title">Rainbow Wavy circle</div>
            </button>

            <button
              type="button"
              className={`settings-list-item-list-subitem subitem-container${
                item.effect == "id_2" ? "-selected" : ""
              }`}
              onClick={() => {
                setEffect("id_2");
                update({ effect: "id_2" });
              }}
            >
              <embed src="../fx/rainbow-confetti/" width="40" height="40" />
              <div className="title">Rainbow Confetti</div>
            </button>

            <button
              type="button"
              className={`settings-list-item-list-subitem subitem-container${
                item.effect == "id_3" ? "-selected" : ""
              }`}
              onClick={() => {
                setEffect("id_3");
                update({ effect: "id_3" });
              }}
            >
              <embed src="../fx/rainbow-orb-big/" width="40" height="40" />
              <div className="title">Rainbow ORB Big</div>
            </button>

            <button
              type="button"
              className={`settings-list-item-list-subitem subitem-container${
                item.effect == "id_4" ? "-selected" : ""
              }`}
              onClick={() => {
                setEffect("id_4");
                update({ effect: "id_4" });
              }}
            >
              <embed src="../fx/hyperspace1/" width="40" height="40" />
              <div className="title">Hyperspace1</div>
            </button>

            <button
              type="button"
              className={`settings-list-item-list-subitem subitem-container${
                item.effect == "id_5" ? "-selected" : ""
              }`}
              onClick={() => {
                setEffect("id_5");
                update({ effect: "id_5" });
              }}
            >
              <embed src="../fx/hyperspace2/" width="40" height="40" />
              <div className="title">Hyperspace2</div>
            </button>

            <button
              type="button"
              className={`settings-list-item-list-subitem subitem-container${
                item.effect == "id_6" ? "-selected" : ""
              }`}
              onClick={() => {
                setEffect("id_6");
                update({ effect: "id_6" });
              }}
            >
              <embed src="../fx/hyperspace3/" width="40" height="40" />
              <div className="title">Hyperspace3</div>
            </button>
          </div>
        </div>
        <div className="settings-list-item" />
      </div>
    </Flex>
  );
}

/*
<div className="settings-list-item">
          <div
            className="settings-list-item-header"
            style={{}}
            onClick={openFolder}
          >
            <div className={`folder-drop ${open ? "open" : ""}`}>
              <IconTreeDropArrow
                style={{ margin: "auto" }}
                fill="var(--color-icon)"
              />
            </div>
            <div className="title">Splashes</div>
          </div>
        </div>
<div
            className="settings-list-item-header"
            style={{}}
            onClick={openFolder}
          >
            <div className={`folder-drop ${open ? "open" : ""}`}>
              <IconTreeDropArrow
                style={{ margin: "auto" }}
                fill="var(--color-icon)"
              />
            </div>
            <div className="title">Background</div>
          </div>
*/
