/* eslint-disable global-require */
export default function getDisplaySize(): { width: number; height: number } {
  const { screen } = require("electron");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  return { width, height };
}
