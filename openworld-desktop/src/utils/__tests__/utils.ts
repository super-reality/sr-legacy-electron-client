/* eslint-env jest */
import path from "path";
import Splash from "../../assets/images/splash.png";
import getFileExt from "../getFileExt";
import getFileSha1 from "../getFileSha1";
import uploadFileToS3 from "../uploadFileToS3";

test("Can get a file extension", () => {
  expect(getFileExt(Splash)).toBe(".png");
  expect(getFileExt("test.txt")).toBe(".txt");
  expect(getFileExt("filenamewith/no/extension")).toBe("");
});

test("Can get a file sha1 hash", () => {
  expect(getFileSha1(Splash)).toBe("da39a3ee5e6b4b0d3255bfef95601890afd80709");
});
/*
test("Can upload to aws", async (done) => {
  let stat = false;
  const file = path.join(
    __dirname,
    "..",
    "..",
    "assets",
    "images",
    "splash.png"
  );
  await uploadFileToS3(file)
    .then(() => {
      stat = true;
    })
    .catch(console.error);

  expect(stat).toBe(true);
  done();
});
*/
