import { Rectangle } from "../../types/utils";

export default function getDisplayBounds(): Rectangle {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  const newBounds: Rectangle = { x: 0, y: 0, width: 0, height: 0 };
  const displays = remote.screen.getAllDisplays();
  newBounds.x = Math.min(...displays.map((display) => display.bounds.x));
  newBounds.y = Math.min(...displays.map((display) => display.bounds.y));
  remote.screen.getAllDisplays().forEach((display) => {
    newBounds.width = Math.max(
      newBounds.width,
      Math.abs(newBounds.x) + display.bounds.x + display.bounds.width
    );
    newBounds.height = Math.max(
      newBounds.height,
      Math.abs(newBounds.y) + display.bounds.y + display.bounds.height
    );
  });
  return newBounds;
}
