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
  const [effect, setEffect] = useState("id1");

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

            <div className="title">Great Success</div>
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
              <img
                src={IconStars}
                alt="icon-stars"
                className="settings-subitem-icon"
              />
              <div className="title">Stars</div>
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
              <img
                src={IconFireworks}
                alt="icon-fireworks"
                className="settings-subitem-icon"
              />
              <div className="title">Fireworks</div>
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
              <img
                src={IconCoins}
                alt="icon-coins"
                className="settings-subitem-icon"
              />
              <div className="title">Coins</div>
            </button>
          </div>
        </div>
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
            <div className="title">Background</div>
          </div>
        </div>
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
      </div>
    </Flex>
  );
}

/*

*/

/*
<ul className="settings-list">
                <li className="settings-list-item">
                    <Flex style={{ flexDirection: "row" }}>
                        <IconTreeDropArrow
                            style={{ position: "relative", top: "10px" }}
                            fill="var(--color-icon)"
                        />
                        <div className="title">Great Success</div>
                    </Flex>


                    <ul className="settings-list-item-list">
                        <li className="settings-list-item-list-subitem subitem-container">
                            <img src={IconStars} alt="icon-stars" className="settings-subitem-icon" />
                            <div className="title">Stars</div>
                        </li>
                        <li className="settings-list-item-list-subitem subitem-container">
                            <img src={IconFireworks} alt="icon-fireworks" className="settings-subitem-icon" />
                            <div className="title">Fireworks</div>
                        </li>
                        <li className="settings-list-item-list-subitem subitem-container">
                            <img src={IconCoins} alt="icon-coins" className="settings-subitem-icon" />
                            <div className="title">Coins</div>
                        </li>
                    </ul>

                </li>

            </ul>
<div className="settings-list-item-list">
                        <div className="settings-list-item-list-subitem"></div>
                        <div className="settings-list-item-list-subitem"></div>
                        <div className="settings-list-item-list-subitem"></div>
                    </div>
<li className="settings-list-item">
                    <div className="title">
                        <ul className="settings-list-item-list">
                            <li className="settings-list-item-list-subitem"><img src="" alt="" className="settings-subitem-icon"/></li>
                            <li className="settings-list-item-list-subitem"><img src="" alt="" className="settings-subitem-icon"/></li>
                            <li className="settings-list-item-list-subitem"><img src="" alt="" className="settings-subitem-icon"/></li>
                        </ul>
                    </div>
                </li>
                <li className="settings-list-item">
                    <div className="title">
                        <ul className="settings-list-item-list">
                            <li className="settings-list-item-list-subitem"><img src="" alt="" className="settings-subitem-icon"/></li>
                            <li className="settings-list-item-list-subitem"><img src="" alt="" className="settings-subitem-icon"/></li>
                            <li className="settings-list-item-list-subitem"><img src="" alt="" className="settings-subitem-icon"/></li>
                        </ul>
                    </div>
                </li>
*/
