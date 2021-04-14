import { useCallback, useState } from "react";
import "./gallery.scss";
import usePopup from "../usePopup";
import { GalleryItem } from "./types";
import { InputChangeEv } from "../../../types/utils";

interface GalleryProps {
  title?: string;
}

export default function useGalleryPopup(
  items: GalleryItem[],
  callback: (selected: GalleryItem | null) => void
): [(props: GalleryProps) => JSX.Element, number | null, () => void] {
  const [GalleryPopup, doOpen, close] = usePopup(false);
  const [inputValue, setInputValue] = useState("");
  const [selected, _setSelected] = useState<null | number>(null);

  const _clickOk = useCallback(() => {
    close();
    callback(selected ? items[selected] : null);
  }, [close]);

  const onChange = useCallback(
    (e: InputChangeEv) => setInputValue(e.currentTarget.value),
    []
  );

  const Gallery = () => {
    return (
      <GalleryPopup width="300px" height="200px">
        <input value={inputValue} onChange={onChange} onKeyDown={onChange} />
        {}
      </GalleryPopup>
    );
  };

  return [Gallery, selected, doOpen];
}
