/* eslint-env jest */
import path from "path";
import Axios from "axios";
import getFileExt from "../files/getFileExt";
import getFileSha1 from "../files/getFileSha1";
import SignIn from "../../renderer/api/types/auth/signin";
import { API_URL } from "../../renderer/constants";
import { ApiError } from "../../renderer/api/types";
import handleAuthError from "../../renderer/api/handleAuthError";
import { DifficultyOptions } from "../../renderer/api/types/lesson/lesson";
import constantFormat from "../constantFormat";
import createDataDirs from "../files/createDataDirs";
import timestampToTime from "../timestampToTime";
import getBoundsPos from "../electron/getBoundsPos";
import getDisplayBounds from "../electron/getDisplayBounds";

jest.setTimeout(30000);

const file = path.join(__dirname, "..", "..", "assets", "images", "splash.png");

test("Can get a file extension", () => {
  expect(getFileExt(file)).toBe(".png");
  expect(getFileExt("test.txt")).toBe(".txt");
  expect(getFileExt("filenamewith/no/extension")).toBe("");
});

test("Can get a file sha1 hash", () => {
  expect(getFileSha1(file)).toBe("7b9d27774fa36de33529ff6b2487cef0bee6d75a");
});

test("Formats constants", () => {
  expect(constantFormat(DifficultyOptions)(DifficultyOptions.Intro)).toBe(
    "Intro"
  );
  expect(
    constantFormat(DifficultyOptions)(DifficultyOptions.Intermediate)
  ).toBe("Intermediate");
  expect(constantFormat(DifficultyOptions)(DifficultyOptions.Beginner)).toBe(
    "Beginner"
  );
  expect(constantFormat(DifficultyOptions)(DifficultyOptions.Advanced)).toBe(
    "Advanced"
  );
  expect(constantFormat(DifficultyOptions)(10)).toBe(undefined);
});
/*
test("Can log in", async (done) => {
  const payload = {
    username: "manwe@gmail.com",
    password: "password",
  };

  const token = await Axios.post<SignIn | ApiError>(
    `${API_URL}auth/signin`,
    payload
  )
    .then((res) =>
      res.status === 200 && res.data.err_code === 0 ? res.data.token : undefined
    )
    .catch(handleAuthError);

  expect(token).toBeDefined();
  // Axios.defaults.headers.post.Authorization = `Bearer ${token}`;
  done();
});
*/
test("Can create data directories", () => {
  expect(createDataDirs()).toBe(true);
});

test("Can parse timestamps", () => {
  expect(timestampToTime("00:01:07:323")).toBe(67323);
  expect(timestampToTime("0:0:5:677")).toBe(5677);
  expect(timestampToTime("1:10:7:323")).toBe(4207323);
  expect(timestampToTime("0:0:0:0")).toBe(0);
  expect(timestampToTime("0")).toBe(0);
  expect(timestampToTime("10:0")).toBe(10000);
});

test("Can get bounds properly", () => {
  // bounds of all screens
  const bounds = { x: -1600, y: -1080, width: 5440, height: 2160 };
  // position of window on screen (fullscreen)
  const windowBounds = { x: 0, y: 0, width: 1920, height: 1050 };

  expect(getBoundsPos(bounds, windowBounds)).toStrictEqual({
    x: 1600,
    y: 1080,
  });
});

test("Can get display bounds properly", () => {
  const displays = [
    {
      bounds: { x: 0, y: 1080, width: 1920, height: 1080 }, // 1
    },
    {
      bounds: { x: 1920, y: 666, width: 1920, height: 1080 }, // 2
    },
    {
      bounds: { x: 0, y: 0, width: 1920, height: 1080 }, // 4
    },
    {
      bounds: { x: -1600, y: 368, width: 1600, height: 900 }, // 3
    },
    {
      bounds: { x: -1280, y: 1268, width: 1280, height: 721 }, // 5
    },
  ];
  expect(getDisplayBounds(displays as any)).toStrictEqual({
    x: -1600,
    y: 0,
    width: 5440,
    height: 2160,
  });

  const displaysTwo = [
    {
      bounds: { x: 0, y: 0, width: 1920, height: 1080 },
    },
    {
      bounds: { x: -1920, y: 1, width: 1920, height: 1080 },
    },
  ];
  expect(getDisplayBounds(displaysTwo as any)).toStrictEqual({
    x: -1920,
    y: 0,
    width: 3840,
    height: 1081,
  });
});
