import { createHash } from "crypto";

export default function hashMD5(str: string) {
  return createHash("md5").update(str).digest("hex");
}
