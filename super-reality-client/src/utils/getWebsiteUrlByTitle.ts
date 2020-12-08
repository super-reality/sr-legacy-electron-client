import globalData from "../renderer/globalData";
import { IpcMsgUrlByTitleResponse } from "../types/ipc";
import { makeIpcListenerOnce } from "./handleIpc";
import ipcSend from "./ipcSend";

export default function getWebsiteUrlByTitle(
  originalTitle: string
): Promise<IpcMsgUrlByTitleResponse["arg"]> {
  // Browsers like to add their name to the titles, we have to remove them all
  const replace = [
    " - Brave",
    " - Google Chrome",
    " - Microsoft Edge",
    " - Mozilla Firefox",
  ];
  let title = originalTitle;
  replace.forEach((str) => {
    title = title.replace(str, "");
  });

  if (globalData.titleUrlDictionary[title]) {
    return new Promise((resolve) => {
      resolve({ title, url: globalData.titleUrlDictionary[title] });
    });
  }

  return new Promise((resolve) => {
    // If not in dictionary, try puppeteer
    const newChannel = `getUrlbyTitleResponse-${new Date().getTime()}`;
    // console.log(`channel: ${newChannel} title: ${title}`);
    makeIpcListenerOnce(newChannel).then((arg) => {
      console.log(newChannel, arg.title, arg.url);
      globalData.titleUrlDictionary[arg.title] = arg.url;
      return resolve(arg);
    });
    ipcSend({
      method: "getUrlbyTitle",
      arg: { title, responseChannel: newChannel },
    });
    setTimeout(resolve, 5000);
  });
}
