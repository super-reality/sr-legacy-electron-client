import { Fragment, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import usePopup from "./usePopup";
import ButtonSimple from "../components/button-simple";
import "../components/popups.scss";
import isElectron from "../../utils/electron/isElectron";
import useMediaInsert from "./useMediaInsert";
import useMediaSniper from "./useMediaSniper";
import { InputChangeEv } from "../../types/utils";
import reduxAction from "../redux/reduxAction";

type Modes = "Buttons" | "Input";

export default function usePopupImageSource(
  callback: (URL: string) => void,
  snip: boolean,
  url: boolean,
  disk: boolean,
  recording: boolean
): [JSX.Element, () => void] {
  const dispatch = useDispatch();
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
    closeWait();
  }, [closeWait]);

  const doWaitStart = useCallback(() => {
    // eslint-disable-next-line global-require
    const { remote } = require("electron");
    remote.globalShortcut.register("Shift+C", () => {
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
            {recording ? (
              <ButtonSimple
                margin="8px auto"
                width="140px"
                height="16px"
                onClick={() => {
                  reduxAction(dispatch, {
                    type: "CREATE_LESSON_V2_DATA",
                    arg: {
                      previewMode: "CREATE_ANCHOR",
                      previewEditArea: {
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 100,
                      },
                    },
                  });
                  close();
                }}
              >
                Recording
              </ButtonSimple>
            ) : (
              <></>
            )}
          </>
        ) : (
          <Fragment key="popup-fragment">
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
          </Fragment>
        )}
      </Popup>
    </>
  );

  return [Element, doOpen];
}
