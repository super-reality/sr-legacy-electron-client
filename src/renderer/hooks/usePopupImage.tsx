import React, { useCallback, useMemo, useState } from "react";
import usePopup from "./usePopup";

export default function usePopupImage(): [
  () => JSX.Element,
  (src: string) => void,
  () => void
] {
  const [Popup, doOpen, close] = usePopup(false);
  const [image, setImage] = useState("");

  const open = useCallback((imageUrl: string) => {
    setImage(imageUrl);
    doOpen();
  }, []);

  const Image = useMemo(
    // eslint-disable-next-line react/display-name
    () => () => {
      return (
        <Popup
          width="fit-content"
          height="fit-content"
          style={{ backgroundColor: "transparent" }}
        >
          <img
            style={{
              maxWidth: "100%",
              justifyContent: "center",
              margin: "auto",
              borderRadius: "4px",
            }}
            src={image}
          />
        </Popup>
      );
    },
    [Popup, image]
  );

  return [Image, open, close];
}
