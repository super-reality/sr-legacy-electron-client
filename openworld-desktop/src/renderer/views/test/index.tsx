import React, { useCallback } from "react";
import "./index.scss";
import ButtonSimple from "../../components/button-simple";
import createFindBox from "../../../utils/createFindBox";

export default function Test(): JSX.Element {
  const onCLose = useCallback(() => console.log("Closed!"), []);

  const onClick = useCallback(() => {
    createFindBox({ x: 100, y: 100, width: 200, height: 100 }).then(onCLose);
  }, []);

  return (
    <div className="mid">
      <ButtonSimple width="200px" height="24px" margin="auto" onClick={onClick}>
        Click me!
      </ButtonSimple>
    </div>
  );
}
