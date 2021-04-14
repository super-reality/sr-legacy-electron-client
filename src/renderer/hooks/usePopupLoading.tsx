import SupperSpinner from "../components/super-spinner";
import { voidFunction } from "../constants";
import usePopup from "./usePopup";

export default function usePopupLoading(
  text: string
): [() => JSX.Element, () => void, () => void] {
  const [SimplePopup, doOpen, doClose] = usePopup(false, voidFunction, true);

  const Modal = () => {
    return (
      <SimplePopup width="240px" height="160px">
        <SupperSpinner style={{ margin: "auto" }} text={text} />
      </SimplePopup>
    );
  };

  return [Modal, doOpen, doClose];
}
