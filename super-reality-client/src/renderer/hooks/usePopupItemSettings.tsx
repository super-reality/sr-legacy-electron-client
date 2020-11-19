import React, { useCallback, useMemo, useState } from "react";
import ButtonSimple from "../components/button-simple";
import usePopup from "./usePopup";

import IconFXInList from "../../assets/images/fx-in-popup-list-icon.png";
import IconFXThumbnail from "../../assets/images/fx-popup-icon.png";
import Flex from "../components/flex";
import { ReactComponent as CloseIcon } from "../../assets/svg/win-close.svg";

const effectDB = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
  { id: "4" },
  { id: "5" },
  { id: "6" },
  { id: "7" },
  { id: "8" },
  { id: "9" },
];
export default function usePopupItemSettings(): [JSX.Element, () => void] {
  const [Popup, doOpen, close] = usePopup(false);
  const [item, setItem] = useState("fx");

  const clickItem = useCallback(() => {
    close();
  }, [close]);

  const Element = (
    <Popup
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#1f2124",
        top: "0px",
        borderRadius: "15px",
      }}
      width="100%"
      height="100%"
    >
      <div
        className="settings-popup-inner"
        style={{
          backgroundColor: "var(--color-section)",
          color: "var(--color-text-active)",
        }}
      >
        <div
          className="settings-popup-name"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Name of FX
        </div>
        <img width="360px" height="340px" src={IconFXThumbnail} alt="Fx Icon" />
        <div className="settings-popup-options">Options</div>
        <div className="settings-popup-exposed">Expoused Values</div>
        <ButtonSimple onClick={clickItem}>Close popup</ButtonSimple>
      </div>
      <div
        className="settings-popup-inner"
        style={{
          backgroundColor: "var(--color-section)",
        }}
      >
        <Flex>
          <div className="popup-settings-input-container">
            <input
              className="popup-settings-input-container-input"
              onChange={() => {}}
              value="currentInputValue"
            />
          </div>
        </Flex>
        <div
          className="settings-popup-tags-container"
          style={{
            display: "flex",
          }}
        >
          <ButtonSimple
            style={{
              backgroundColor: "inherit",
              border: "var(--color-text) solid 1px",
            }}
            onClick={() => {}}
          >
            Pop
            <CloseIcon height="10px" width="10px" />
          </ButtonSimple>
          <ButtonSimple
            style={{
              backgroundColor: "inherit",
              border: "var(--color-text) solid 1px",
            }}
            onClick={() => {}}
          >
            Celebration
            <CloseIcon height="10px" width="10px" />
          </ButtonSimple>
          <ButtonSimple
            style={{
              backgroundColor: "inherit",
              border: "var(--color-text) solid 1px",
            }}
            onClick={() => {}}
          >
            Ambient
            <CloseIcon height="10px" width="10px" />
          </ButtonSimple>
        </div>
        <Flex
          style={{
            flexWrap: "wrap",
          }}
        >
          {effectDB.map((fxIcon) => {
            return (
              <div key={fxIcon.id}>
                <img width="200px" height="200px" src={IconFXInList} />
              </div>
            );
          })}
        </Flex>
      </div>
    </Popup>
  );

  return [Element, doOpen];
}
