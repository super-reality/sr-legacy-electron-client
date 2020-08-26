import React, { useCallback } from "react";
import usePopup from "./usePopup";

interface ModalProps {
  newTitle?: string;
}

export default function usePopupModal(
  title?: string,
  callbackYes?: () => void,
  callbackNo?: () => void
): [(props: ModalProps) => JSX.Element, () => void] {
  const [YesNoPopup, doOpen, close] = usePopup(false);

  const clickYes = useCallback(() => {
    close();
    if (callbackYes) callbackYes();
  }, [close, callbackYes]);

  const clickNo = useCallback(() => {
    close();
    if (callbackNo) callbackNo();
  }, [close, callbackNo]);

  const Modal = (props: ModalProps) => {
    const { newTitle } = props;
    return (
      <YesNoPopup width="300px" height="250px">
        <div className="popup-title">{newTitle || title || ""}</div>
        <div className="popup-modal">
          <div className="modal-yes" onClick={clickYes}>
            Yes
          </div>
          <div className="modal-no" onClick={clickNo}>
            No
          </div>
        </div>
      </YesNoPopup>
    );
  };

  return [Modal, doOpen];
}
