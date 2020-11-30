/* eslint-disable radix */

/**
 * Coverts a timestamp in the format "HH:MM:SS:mmm" to miliseconds
 * It also accepts formats like "MM:SS:mmm" and "SS:mmm"
 */
export default function timestampToTime(timestamp: string): number {
  // return parseInt(timestamp.replace(/:/g, ""));

  const timestampFormat = timestamp.split(":");
  const spaces = timestampFormat.length;
  const seconds =
    +parseInt(timestampFormat[spaces - 4] || "0") * 60 * 60 +
    +parseInt(timestampFormat[spaces - 3] || "0") * 60 +
    +parseInt(timestampFormat[spaces - 2] || "0");
  const milliSeconds = timestampFormat[spaces - 1] || "0";
  return seconds * 1000 + parseInt(milliSeconds);
}
