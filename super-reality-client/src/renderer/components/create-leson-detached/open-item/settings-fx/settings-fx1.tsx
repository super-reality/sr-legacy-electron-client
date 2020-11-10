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

type FXNamesType = "Stars" | "Fireworks" | "Coins";
const FXNames: FXNamesType[] = ["Stars", "Fireworks", "Coins"];

interface FXsubitemProps {
  id: string;
  name: string;
  icon: string;
  effect: string;
}
// interface FXsubitem {
//   subitem:FXsubitemProps;
// }
const FXsubitem = (props: FXsubitemProps): JSX.Element => {
  const { name, icon, id, effect } = props;

  const isSelected = effect == id ? "-selected" : "";

  return (
    <div
      className={`settings-list-item-list-subitem subitem-container${isSelected}`}
    >
      <img src={icon} alt="icon-stars" className="settings-subitem-icon" />
      <div className="title">{name}</div>
    </div>
  );
};

type FXItemName = "Great Success" | "Background" | "Splashes";

interface FXItemProp {
  id: string;
  name: string;
  effect: string;
  subitems?: any;
}

const FXItem = (props: FXItemProp): JSX.Element => {
  const { id, name, subitems, effect } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [currentEffect, setCurrentEffect] = useState(effect);
  const makeEffect = useCallback(() => {
    setCurrentEffect(id);
  }, [currentEffect]);

  const openFolder = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      setOpen(!open);
    },
    [open]
  );
  return (
    <div key={name} className="settings-list">
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

          <div className="title">{name}</div>
        </div>
        <div className="settings-list-item-list">
          {open && subitems
            ? subitems.map((subitem: any) => {
                return (
                  <FXsubitem
                    key={subitem.name}
                    name={subitem.name}
                    icon={subitem.icon}
                    id={subitem.id}
                    effect={effect}
                  />
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

interface FXSettingsProps {
  style?: CSSProperties;
}

export default function FXSettings(): JSX.Element {
  const dispatch = useDispatch();

  return (
    <Flex style={{ backgroundColor: "var(--color-background)" }}>
      {TestFXItems.map((item) => {
        return (
          <FXItem
            key={item.name}
            id={item.id}
            name={item.name}
            subitems={item.subitems}
            effect={item.effect}
          />
        );
      })}
    </Flex>
  );
}

/*
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
            <div className="settings-list-item-list-subitem subitem-container">
              <img
                src={IconStars}
                alt="icon-stars"
                className="settings-subitem-icon"
              />
              <div className="title">Stars</div>
            </div>
            <div className="settings-list-item-list-subitem subitem-container">
              <img
                src={IconFireworks}
                alt="icon-fireworks"
                className="settings-subitem-icon"
              />
              <div className="title">Fireworks</div>
            </div>
            <div className="settings-list-item-list-subitem subitem-container">
              <img
                src={IconCoins}
                alt="icon-coins"
                className="settings-subitem-icon"
              />
              <div className="title">Coins</div>
            </div>
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
