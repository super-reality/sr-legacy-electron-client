import fs from "fs";
import crypto from "crypto";

export default function getFileSha1(path: string): string {
  let data = "";
  try {
    data = fs.readFileSync(path, "utf8");
  } catch (err) {
    console.error(err);
  }
  const random = Math.random().toString();
  return crypto
    .createHash("sha1")
    .update(data + random, "utf8")
    .digest("hex");
}
