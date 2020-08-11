import React, {useCallback} from "react";
import "./index.scss";
import usePopup from "../../components/popup";

export default function Test(): JSX.Element {
  const closePopup = useCallback(() => console.log("popup closed"), []);

  const [Popup, open] = usePopup(false, closePopup);

  return (
    <div className="mid">
      <Popup width="600px" height="300px">
        Popup test!
      </Popup>
      <div
        style={{
          cursor: "pointer",
          backgroundColor: "#C0C0C0",
          textAlign: "center",
          color: "#000",
          width: "200px",
          height: "32px",
        }}
        onClick={open}
      >
        Click me!
      </div>
    </div>
  );
}
