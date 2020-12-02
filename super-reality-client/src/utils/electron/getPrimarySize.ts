import { Rectangle } from "../../types/utils";

export default function getPrimarySize(): Rectangle {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  return remote.screen.getPrimaryDisplay().bounds;
}
