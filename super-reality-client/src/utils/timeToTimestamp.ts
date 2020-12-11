/* eslint-disable radix */

/**
 * Reverse function of timestampToTime. Takes a number of miliseconds and converts it to "HH:MM:SS:mmm"
 */
export default function timetoTimestamp(tt: number): string {
  let time = tt;
  const miliseconds = Math.floor(time % 1000);
  time = Math.floor((time - miliseconds) / 1000);
  const seconds = Math.floor(time % 60);
  time -= seconds;
  const minutes = Math.floor((time % (60 * 60)) / 60);
  time -= minutes;
  const hours = Math.floor(time / 60 / 60);

  return `${`${hours}`.padStart(2, "0")}:${`${minutes}`.padStart(
    2,
    "0"
  )}:${`${seconds}`.padStart(2, "0")}:${`${miliseconds}`.padStart(2, "0")}`;
}
