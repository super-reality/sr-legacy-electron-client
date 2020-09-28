import fs from "fs";
import crypto from "crypto";

export default function getFileSha1(path: string): string {
  let data = "";
  try {
    data = fs.readFileSync(path, "utf8");
  } catch (err) {
    console.error(err);
  }

  return crypto.createHash("sha1").update(data, "utf8").digest("hex");
}
