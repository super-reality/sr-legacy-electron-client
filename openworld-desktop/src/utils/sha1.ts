import crypto from "crypto";

export default function sha1(str: string): string {
  return crypto.createHash("sha1").update(str, "utf8").digest("hex");
}
