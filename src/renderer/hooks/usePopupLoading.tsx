import React from "react";
import Spinner from "../components/super-spinner";
import usePopup from "./usePopup";

export default function usePopupLoading(
  text: string
): [() => JSX.Element, () => void, () => void] {
  const [SimplePopup, doOpen, doClose] = usePopup(false);

  const Modal = () => {
    return (
      <SimplePopup width="240px" height="160px">
        <Spinner width="64px" style={{ margin: "auto" }} text={text} />
      </SimplePopup>
    );
  };

  return [Modal, doOpen, doClose];
}
