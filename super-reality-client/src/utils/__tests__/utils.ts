/* eslint-env jest */
import path from "path";
import getFileExt from "../files/getFileExt";
import getFileSha1 from "../files/getFileSha1";
import { DifficultyOptions } from "../../renderer/api/types/lesson/lesson";
import constantFormat from "../constantFormat";
import createDataDirs from "../files/createDataDirs";
import timestampToTime from "../timestampToTime";
import getDisplayPosition from "../electron/getDisplayPosition";
import getDisplayBounds from "../electron/getDisplayBounds";
import timetoTimestamp from "../timeToTimestamp";

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
  return expect(createDataDirs()).resolves.toBe(true);
});

test("Can convert to timestamps", () => {
  expect(timetoTimestamp(10000)).toBe("00:00:10:00");
  expect(timetoTimestamp(5677)).toBe("00:00:05:677");
  expect(timetoTimestamp(67323)).toBe("00:01:07:323");
  expect(timetoTimestamp(10867543)).toBe("03:01:07:543");
  expect(timetoTimestamp(4207323)).toBe("01:10:07:323");
  expect(timetoTimestamp(0)).toBe("00:00:00:00");
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
  const nickBounds = { x: 0, y: -1080, width: 3863, height: 2160 };
  const nickDisplay = { x: 0, y: 0, width: 1920, height: 1080 };

  expect(getDisplayPosition(nickBounds, nickDisplay)).toStrictEqual({
    x: 0,
    y: 1080,
  });

  const manweBounds = { x: -1920, y: 0, width: 2160, height: 1080 };
  const manweDisplay = { x: 0, y: 0, width: 1920, height: 1080 };

  expect(getDisplayPosition(manweBounds, manweDisplay)).toStrictEqual({
    x: 1920,
    y: 0,
  });

  const jamieBounds = { x: -1600, y: -1080, width: 5440, height: 2160 };
  const jamioeDisplay = { x: 0, y: 0, width: 1920, height: 1050 };

  expect(getDisplayPosition(jamieBounds, jamioeDisplay)).toStrictEqual({
    x: 1600,
    y: 1080,
  });

  const jamieBoundsShifted = { x: -1600, y: 0, width: 5440, height: 2160 };
  const jamieDisplayShifted = { x: 0, y: 0, width: 1920, height: 1080 };

  expect(
    getDisplayPosition(jamieBoundsShifted, jamieDisplayShifted)
  ).toStrictEqual({
    x: 1600,
    y: 0,
  });
});

test("Can get display bounds properly", () => {
  const displaysNick = [
    { bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
    { bounds: { x: 1924, y: 0, width: 1920, height: 1080 } },
    { bounds: { x: 23, y: -1080, width: 3840, height: 1080 } },
  ];

  expect(getDisplayBounds(displaysNick as any)).toStrictEqual({
    x: 0,
    y: -1080,
    width: 3863,
    height: 2160,
  });

  const displaysJamie = [
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

  expect(getDisplayBounds(displaysJamie as any)).toStrictEqual({
    x: -1600,
    y: 0,
    width: 5440,
    height: 2160,
  });

  const displaysPrimaryChange = [
    {
      bounds: { x: 0, y: 0, width: 1920, height: 1080 },
    },
    {
      bounds: { x: 1920, y: -417, width: 1920, height: 1080 },
    },
    {
      bounds: { x: 0, y: -1080, width: 1920, height: 1080 },
    },
    {
      bounds: { x: -1600, y: -900, width: 1600, height: 900 },
    },
    {
      bounds: { x: -1280, y: 188, width: 1280, height: 721 },
    },
  ];
  expect(getDisplayBounds(displaysPrimaryChange as any)).toStrictEqual({
    x: -1600,
    y: -1080,
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
