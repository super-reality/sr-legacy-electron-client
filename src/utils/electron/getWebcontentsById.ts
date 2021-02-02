export default function getBrowserWindowById(
  id: number
): Electron.BrowserWindow | null {
  // eslint-disable-next-line global-require
  const windows = require("electron")
    .remote.BrowserWindow.getAllWindows()
    .filter((w) => w.id == id);
  if (windows.length > 0) return windows[0];
  return null;
}
