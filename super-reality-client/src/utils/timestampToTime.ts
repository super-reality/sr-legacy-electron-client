/* eslint-disable radix */

export default function timestampToTime(timestamp: string): number {
  return parseInt(timestamp.replace(/:/g, ""));
}
