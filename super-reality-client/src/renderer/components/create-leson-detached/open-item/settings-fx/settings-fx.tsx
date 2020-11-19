import React, {
  CSSProperties,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import "./settings-fx.scss";

import { useDispatch, useSelector } from "react-redux";
import Flex from "../../../flex";
import { AppState } from "../../../../redux/stores/renderer";
import reduxAction from "../../../../redux/reduxAction";

import { ReactComponent as IconTreeDropArrow } from "../../../../../assets/svg/tree-drop.svg";
import { ReactComponent as IconAddFX } from "../../../../../assets/svg/new-fx-icon.svg";
import IconFXThumbnail from "../../../../../assets/images/fx-popup-icon.png";
import { ItemFX } from "../../../../api/types/item/item";
import ButtonSimple from "../../../button-simple";

import usePopupItemSettings from "../../../../hooks/usePopupItemSettings";

// const TestFXItems = [
//   {
//     id: "1",
//     name: "Great Success",
//     effect: "id_1",
//     subitems: [
//       {
//         id: "id_1",
//         name: "Stars",
//         icon: IconStars,
//         effect: "id_1",
//       },
//       {
//         id: "id_2",
//         name: "Fireworks",
//         icon: IconFireworks,
//         effect: "id_1",
//       },
//       {
//         id: "id_3",
//         name: "Coins",
//         icon: IconCoins,
//         effect: "id_1",
//       },
//     ],
//   },
// ];

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
  // const [open, setOpen] = useState<boolean>(false);
  const [effect, setEffect] = useState("id_1");
  const [isHover, setIsHover] = useState("");

  const effectOneRef = useRef<HTMLDivElement>(null);
  const effectSecondRef = useRef<HTMLDivElement>(null);

  // const openFolder = useCallback(
  //   (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
  //     setOpen(!open);
  //   },
  //   [open]
  // );

  const onHover = useCallback(() => {
    if (effectOneRef.current && effectOneRef.current.id) {
      setIsHover(effectOneRef.current.id);
      console.log(isHover, effectOneRef.current);
    }
  }, []);

  const onHoverEnd = useCallback(() => {
    setIsHover("");
    console.log(isHover);
  }, []);

  const toggleFullScreen = useCallback((event) => {
    event.preventDefault();
    update({ fullScreen: !item.fullScreen });
  }, []);

  const [Popup, open] = usePopupItemSettings();

  return (
    <>
      {Popup}

      <div className="settings-item-lable ">
        <IconAddFX
          width="16px"
          height="16px"
          style={{
            margin: "3px 5px 3px 0",
          }}
        />
        <div className="item-lable-name">FX</div>
      </div>
      <div className="item-settings">
        <div
          className="input-name"
          style={{
            color: "var(--color--text)",
          }}
        >
          Style
        </div>
        <div className="settings-item-icon" onClick={open}>
          <img
            width="50px"
            height="50px"
            src={IconFXThumbnail}
            alt="icon-fx"
            className="settings-subitem-icon"
          />
        </div>
        <div className="settings-input-container">
          <div
            className="input-name"
            style={{
              color: "var(--color--text)",
            }}
          >
            Computer Vision
          </div>
          <div className="settings-input-container-input-box">
            <input
              className="settings-input-container-input"
              onChange={() => {}}
              value="currentInputValue"
            />
            <IconTreeDropArrow
              style={{ margin: "auto" }}
              fill="var(--color-icon)"
            />
          </div>
        </div>
        <div className="anchor-preview" />
        <div className="settings-input-container">
          <div
            className="input-name"
            style={{
              color: "var(--color--text)",
            }}
          >
            Trigger
          </div>
          <div className="settings-input-container-input-box">
            <input
              className="settings-input-container-input"
              onChange={() => {}}
              value="currentInputValue"
            />
            <IconTreeDropArrow
              style={{ margin: "auto" }}
              fill="var(--color-icon)"
            />
          </div>
        </div>
      </div>
    </>
  );
}

/*
<ButtonSimple
        style={{
          margin: "5px",
          width: "100px",
        }}
        onClick={() => {
          update({ fullScreen: !item.fullScreen });
        }}
      >
        Full Screen
      </ButtonSimple>
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
              <div
                ref={effectOneRef}
                className={`settings-list-item-list-subitem subitem-container${
                  item.effect == "id_1" ? "-selected" : ""
                }`}
                onClick={() => {
                  setEffect("id_1");
                  update({ effect: "id_1" });
                }}
                onMouseEnter={onHover}
                onMouseLeave={onHoverEnd}
                id="id_1"
              >
                {isHover !== "id_1" ? (
                  <img
                    src={IconFXThumbnail}
                    alt="icon-stars"
                    className="settings-subitem-icon"
                  />
                ) : (
                  <embed
                    src={`${process.env.PUBLIC_URL}/fx/rainbow-circle-wavy-big/index.html`}
                    width="40"
                    height="40"
                  />
                )}

                <div className="title">Rainbow Wavy circle</div>
              </div>

              <div
                className={`settings-list-item-list-subitem subitem-container${
                  item.effect == "id_2" ? "-selected" : ""
                }`}
                onClick={() => {
                  setEffect("id_2");
                  update({ effect: "id_2" });
                }}
                onMouseEnter={onHover}
                onMouseLeave={onHoverEnd}
                id="id_2"
              >
                <embed
                  src={`${process.env.PUBLIC_URL}/fx/rainbow-confetti/index.html`}
                  width="40"
                  height="40"
                />

                <div className="title">Rainbow Confetti</div>
              </div>

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
                <embed
                  src={`${process.env.PUBLIC_URL}/fx/rainbow-orb-big/index.html`}
                  width="40"
                  height="40"
                />
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
                <embed
                  src={`${process.env.PUBLIC_URL}/fx/hyperspace1/index.html`}
                  width="40"
                  height="40"
                />
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
                <embed
                  src={`${process.env.PUBLIC_URL}/fx/hyperspace2/index.html`}
                  width="40"
                  height="40"
                />
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
                <embed
                  src={`${process.env.PUBLIC_URL}/fx/hyperspace3/index.html`}
                  width="40"
                  height="40"
                />
                <div className="title">Hyperspace3</div>
              </button>
            </div>
          </div>
          <div className="settings-list-item" />
        </div>
      </Flex>
*/
