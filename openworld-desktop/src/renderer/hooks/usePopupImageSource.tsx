import React, { useCallback, useState } from "react";
import usePopup from "./usePopup";
import ButtonSimple from "../components/button-simple";
import "../components/popups.scss";
import isElectron from "../../utils/isElectron";
import useMediaInsert from "./useMediaInsert";
import useMediaSniper from "./useMediaSniper";
import { InputChangeEv } from "../../types/utils";

type Modes = "Buttons" | "Input";

export default function usePopupImageSource(
  callback: (url: string) => void,
  snip: boolean = false,
  url: boolean = false,
  disk: boolean = false
): [JSX.Element, () => void] {
  const [Popup, doOpen, close] = usePopup(false);
  const [mode, setMode] = useState<Modes>("Buttons");
  const [value, setValue] = useState("");

  const onChange = useCallback((e: InputChangeEv) => {
    setValue(e.currentTarget.value);
  }, []);

  const call = useCallback(callback, [callback]);

  const openDisk = useMediaInsert(call);
  const openSniper = useMediaSniper(call);

  const Element = (
    <Popup width="300px" height="auto">
      <div className="popup-regular-title">Choose an image source</div>
      {mode == "Buttons" ? (
        <>
          {disk ? (
            <ButtonSimple
              margin="8px auto"
              width="140px"
              height="16px"
              onClick={() => {
                openDisk();
                close();
              }}
            >
              From disk
            </ButtonSimple>
          ) : (
            <></>
          )}
          {snip && isElectron() ? (
            <ButtonSimple
              margin="8px auto"
              width="140px"
              height="16px"
              onClick={() => {
                openSniper();
                close();
              }}
            >
              Screen area
            </ButtonSimple>
          ) : (
            <></>
          )}
          {url ? (
            <ButtonSimple
              margin="8px auto"
              width="140px"
              height="16px"
              onClick={() => {
                setMode("Input");
              }}
            >
              URL
            </ButtonSimple>
          ) : (
            <></>
          )}
        </>
      ) : (
        <React.Fragment key="popup-fragment">
          <input
            autoFocus
            style={{ margin: "8px" }}
            placeholder="Input media URL"
            onKeyDown={onChange}
            onChange={onChange}
            value={value}
          />
          <ButtonSimple
            margin="8px auto"
            width="140px"
            height="16px"
            onClick={() => (value !== "" ? callback(value) : false)}
          >
            Ok
          </ButtonSimple>
        </React.Fragment>
      )}
    </Popup>
  );

  return [Element, doOpen];
}
