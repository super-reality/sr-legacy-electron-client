/* eslint-env jest */
import path from "path";
import getFileExt from "../getFileExt";
import getFileSha1 from "../getFileSha1";
import uploadFileToS3 from "../uploadFileToS3";

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

test("Can upload to aws", async (done) => {
  let stat = false;
  await uploadFileToS3(file)
    .then(() => {
      stat = true;
    })
    .catch(console.error);

  expect(stat).toBe(true);
  done();
});
