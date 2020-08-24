// A simple test to verify a visible window is opened with a title
import { Application } from "spectron";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import path from "path";

const electron = require("electron");

const electronPath: unknown = electron;

expect.extend({ toMatchImageSnapshot });

const electronApp = new Application({
  path: electronPath as string,
  host: "localhost",
  port: 3000,
  args: [path.join(__dirname, "..", "..")],
});

beforeAll(() => {
  return new Promise((resolve, reject) => {
    electronApp
      .start()
      .then(() => {
        return electronApp.browserWindow.isVisible();
      })
      .then((isVisible) => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
});

afterAll(() => {
  electronApp.stop();
});

test("Tests", () => {
  return electronApp.browserWindow.capturePage().then((image) => {
    expect(image).toMatchImageSnapshot();
  });
});
