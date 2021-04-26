import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import reduxAction from "../redux/reduxAction";
import usePopupModal from "./usePopupModal";

export default function usePopupAdd(
  checked: boolean,
  type: "subject" | "collection" | "lesson",
  id: string
): [() => JSX.Element, () => void] {
  const dispatch = useDispatch();
  useState();

  const clickYes = useCallback(() => {
    let t = "USERDATA_TOGGLE_SUBJECT";
    if (type == "collection") t = "USERDATA_TOGGLE_COLLECTION";
    if (type == "lesson") t = "USERDATA_TOGGLE_LESSON";
    reduxAction(dispatch, { type: t, arg: id } as any);
  }, [checked]);

  const [PopupModal, open] = usePopupModal("", clickYes);

  const Modal = () => (
    <PopupModal
      newTitle={
        checked ? `Remove from your ${type}s?` : `Add to your ${type}s?`
      }
    />
  );

  return [Modal, open];
}
