import React, { useCallback, useState } from "react";
import usePopup from "./usePopup";
import ButtonSimple from "../components/button-simple";
import "../components/popups.scss";
import isElectron from "../../utils/isElectron";
import useMediaInsert from "./useMediaInsert";
import useMediaSniper from "./useMediaSniper";
import { InputChangeEv } from "../../types/utils";
import closeFindBox from "../../utils/closeFindBox";

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

  const [WaitingPopup, doWait, closeWait] = usePopup(false);

  const unregister = useCallback(() => {
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    remote.globalShortcut.unregister("Shift+C");
    doWait();
  }, []);

  const doWaitStart = useCallback(() => {
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    remote.globalShortcut.register("Shift+C", () => {
      closeFindBox();
      openSniper();
      unregister();
    });
    doWait();
  }, [doWait]);

  const Element = (
    <>
      <WaitingPopup width="300px" height="auto">
        <div className="popup-title">Press Shift + C to capture the screen</div>
      </WaitingPopup>
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
                  doWaitStart();
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
              onClick={() => {
                if (value !== "") {
                  call(value);
                  close();
                }
              }}
            >
              Ok
            </ButtonSimple>
          </React.Fragment>
        )}
      </Popup>
    </>
  );

  return [Element, doOpen];
}
