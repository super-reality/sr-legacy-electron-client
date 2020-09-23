/* eslint-env jest */
import path from "path";
import { AppState } from "../../renderer/redux/stores/renderer";
import doCvMatch from "../doCVMatch";

describe("Computer Vision", () => {
  const capture = path.join(__dirname, "capture.png");
  const match1 = path.join(__dirname, "match_1.png");

  const defaultOptions: AppState["settings"] = {
    cvMatchValue: 990,
    cvCanvas: 50,
    cvDelay: 100,
    cvGrayscale: true,
    cvApplyThreshold: false,
    cvThreshold: 127,
  };

  test("Can find test target with default settings", async (ret) => {
    await doCvMatch([match1], capture, defaultOptions).then((res) =>
      expect(res.dist).toBeGreaterThan(0.99)
    );
    return ret;
  });
});
