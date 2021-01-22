import React, { useCallback, useState } from "react";
import { InputChangeEv } from "../../types/utils";
import ButtonSimple from "../components/button-simple";
import usePopup from "./usePopup";

interface InputProps {
  newTitle?: string;
}

export default function usePopupInput(
  title: string,
  callback: (val: string) => void
): [(props: InputProps) => JSX.Element, () => void] {
  const [Popup, doOpen, close] = usePopup(false);
  const [inputVal, setInputVal] = useState<string>("");

  const onChange = useCallback((e: InputChangeEv) => {
    setInputVal(e.currentTarget.value);
  }, []);

  const onOk = useCallback(() => {
    close();
    callback(inputVal);
  }, [inputVal, callback, close]);

  const Modal = (props: InputProps) => {
    const { newTitle } = props;
    return (
      <Popup width="400px" height="200px">
        <div className="popup-title">{newTitle || title || ""}</div>
        <div style={{ margin: "8px auto", width: "300px" }}>
          <input
            ref={(input) => input?.focus()}
            value={inputVal}
            onChange={onChange}
            onKeyDown={onChange}
          />
        </div>
        <ButtonSimple
          style={{ margin: "16px auto" }}
          width="180px"
          className="button"
          onClick={onOk}
        >
          Ok
        </ButtonSimple>
      </Popup>
    );
  };

  return [Modal, doOpen];
}
