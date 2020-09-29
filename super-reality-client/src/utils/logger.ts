import log from "electron-log";

type LogType = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

export default function logger(type: LogType, arg: any): void {
  switch (type) {
    case "error":
      log.error(arg);
      break;
    case "warn":
      log.warn(arg);
      break;
    case "verbose":
      log.verbose(arg);
      break;
    case "debug":
      log.debug(arg);
      break;
    case "silly":
      log.silly(arg);
      break;
    default:
      log.info(arg);
  }
}
