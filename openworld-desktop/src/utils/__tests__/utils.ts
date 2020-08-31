/* eslint-env jest */
import path from "path";
import Axios from "axios";
import getFileExt from "../getFileExt";
import getFileSha1 from "../getFileSha1";
import uploadFileToS3 from "../uploadFileToS3";
import SignIn from "../../renderer/api/types/auth/signin";
import { API_URL } from "../../renderer/constants";
import { ApiError } from "../../renderer/api/types";
import handleAuthError from "../../renderer/api/handleAuthError";

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
