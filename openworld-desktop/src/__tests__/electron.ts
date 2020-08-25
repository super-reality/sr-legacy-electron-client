// A simple test to verify a visible window is opened with a title
import { Application } from "spectron";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import path from "path";

jest.setTimeout(20000);
expect.extend({ toMatchImageSnapshot });

// Only to test locally
process.env.ELECTRON_START_URL = "http://localhost:3000";

const electron = require("electron");

const electronPath: unknown = electron;
const electronApp = new Application({
  path: electronPath as string,
  args: [path.join(__dirname, "..", "..")],
});

beforeAll(async (done) => {
  await electronApp.start();
  done();
});

afterAll(() => {
  electronApp.stop();
});

function ensureBrowserWindow() {
  return new Promise((resolve, reject) => {
    if (electronApp.browserWindow !== undefined) return resolve();
    if (electronApp.electron.BrowserWindow !== undefined) return resolve();
    return setTimeout(ensureBrowserWindow, 100);
  });
}

test("Tests", async () => {
  await ensureBrowserWindow();
  // const rendererWindow = electronApp.electron.BrowserWindow.getAllWindows()[0];
  // const mainWindow = electronApp.mainProcess;

  /*
  await electronApp.client
    .$$("#splash-login")
    .then((el) => el[0].click())
    .catch(console.error);
  */
  /*
  const btn = await electronApp.client
    .getElementValue(`//*[@id="splash-login"]`)
    .catch(console.error);
  if (btn) await electronApp.client.elementClick(btn).catch(console.error);
  */
  /*
  const callback = jest.fn();
  mainWindow.electron.ipcMain.on("pong", () => {
    callback();
  });
  expect(callback).toBeCalled();
  rendererWindow.webContents.send("ping");
  */

  return electronApp.browserWindow
    .capturePage()
    .then((image) => {
      expect(image).toMatchImageSnapshot();
    })
    .catch(console.error);
});
