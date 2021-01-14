import React from "react";
import "./App.scss";
import { useSelector } from "react-redux";
import { AppState } from "./redux/stores/renderer";
import SnipingTool from "./components/sniping-tool";

export default function DetachController(): JSX.Element {
  const { detached } = useSelector((state: AppState) => state.commonProps);

  return <>{detached?.type == "SNIPING_TOOL" && <SnipingTool />}</>;
}
