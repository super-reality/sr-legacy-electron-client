/* eslint-env jest */
import path from "path";
import { AppState } from "../renderer/redux/stores/renderer";
import doCvMatch from "../utils/cv/doCVMatch";

jest.mock("../opencv/opencv", () => {
  // eslint-disable-next-line global-require
  return require("opencv4nodejs-prebuilt");
});

function isBetween(x: number, min: number, max: number) {
  return x >= min && x <= max;
}

function isNear(x: number, target: number, range: number) {
  return isBetween(x, target - range, target + range);
}

describe("Computer Vision", () => {
  const capture = path.join(__dirname, "images", "capture.png");
  const matchGoogle = path.join(__dirname, "images", "match_google.png");
  const matchSonic = path.join(__dirname, "images", "match_sonic.png");
  const matchCode = path.join(__dirname, "images", "match_code.png");
  const matchColor1 = path.join(__dirname, "images", "match_color_1.png");

  const thresholdOptions: AppState["settings"]["cv"] = {
    cvMatchValue: 0,
    cvCanvas: 50,
    cvDelay: 100,
    cvGrayscale: true,
    cvApplyThreshold: true,
    cvThreshold: 100,
  };

  const codeOptions: AppState["settings"]["cv"] = {
    cvMatchValue: 0,
    cvCanvas: 100,
    cvDelay: 100,
    cvGrayscale: false,
    cvApplyThreshold: false,
    cvThreshold: 127,
  };

  const defaultOptions: AppState["settings"]["cv"] = {
    cvMatchValue: 0,
    cvCanvas: 50,
    cvDelay: 100,
    cvGrayscale: true,
    cvApplyThreshold: false,
    cvThreshold: 127,
  };

  test("Can find code", async (done) => {
    await doCvMatch([matchCode], capture, codeOptions)
      .then((res) => {
        expect(res.dist).toBeGreaterThan(0.99);
        expect(isNear(res.x, 394, 2)).toBeTruthy();
        expect(isNear(res.y, 168, 2)).toBeTruthy();
      })
      .catch(console.error);

    done();
  });

  test("Can find with OR", async (done) => {
    await doCvMatch(
      [matchGoogle, matchSonic, matchCode, matchColor1],
      capture,
      thresholdOptions
    )
      .then((res) => {
        expect(res.dist).toBeGreaterThan(0.99);
      })
      .catch(console.error);
    done();
  });

  test("Can find test target with default settings", async (done) => {
    await doCvMatch([matchGoogle], capture, defaultOptions)
      .then((res) => {
        expect(res.dist).toBeGreaterThan(0.99);
        expect(isNear(res.x, 1153, 2)).toBeTruthy();
        expect(isNear(res.y, 793, 2)).toBeTruthy();
      })
      .catch(console.error);

    done();
  });
});
