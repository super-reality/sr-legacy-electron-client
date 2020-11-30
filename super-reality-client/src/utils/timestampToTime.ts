/* eslint-disable radix */

export default function timestampToTime(timestamp: string): number {
  // return parseInt(timestamp.replace(/:/g, ""));

  const timestampFormat = timestamp.split(":");
  const seconds =
    +timestampFormat[0] * 60 * 60 +
    +timestampFormat[1] * 60 +
    +timestampFormat[2];
  const milliSeconds = timestampFormat[3];
  return seconds * 1000 + parseInt(milliSeconds);
}
