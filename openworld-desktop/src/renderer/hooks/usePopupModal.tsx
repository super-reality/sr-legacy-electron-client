import React, { useCallback } from "react";
import usePopup from "./usePopup";

export default function usePopupModal(
  title: string,
  callbackYes?: () => void,
  callbackNo?: () => void
): [() => JSX.Element, () => void] {
  const [YesNoPopup, doOpen, close] = usePopup(false);

  const clickYes = useCallback(() => {
    close();
    if (callbackYes) callbackYes();
  }, [close]);

  const clickNo = useCallback(() => {
    close();
    if (callbackNo) callbackNo();
  }, [close]);

  const Modal = () => (
    <YesNoPopup width="300px" height="250px">
      <div className="popup-title">{title}</div>
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

  return [Modal, doOpen];
}
