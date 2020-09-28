import globalData from "../renderer/globalData";

export default function closeFindBox(): void {
  if (globalData.cvFindWindow != null) {
    globalData.cvFindWindow.close();
    globalData.cvFindWindow.destroy();
    globalData.cvFindWindow = null;
  }
}
