import globalData from "../../renderer/globalData";
import getDisplayBounds from "./getNewBounds";
import setFocusable from "./setFocusable";

// CURRENTLY UNUSED
// Resizes the window to use the all of the displays area
export default function setFullBounds(set: boolean) {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");

  if (set) {
    globalData.prevBounds = remote.getCurrentWindow().getBounds();
    const newBounds = getDisplayBounds();
    remote.getCurrentWindow().setBounds({ ...newBounds, x: 0, y: 0 });
    setTimeout(() => {
      remote.getCurrentWindow().setBounds(newBounds);
      setFocusable(false);
    }, 500);
  } else {
    const newBounds = globalData.prevBounds;
    remote.getCurrentWindow().setBounds({ ...newBounds, x: 0, y: 0 });
    setTimeout(() => {
      remote.getCurrentWindow().setBounds(newBounds);
      setFocusable(true);
    }, 500);
  }
}
