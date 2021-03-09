import globalData from "../../renderer/globalData";
import getImageForOcr from "./getImageForOcr";

export default function getTextFromOcr(
  language: string,
  imageUrl: string
): Promise<string> {
  return new Promise((resolve) => {
    return getImageForOcr(imageUrl)
      .then((imgBuffer) => {
        resolve(globalData.ocrService.getText(imgBuffer));
      })
      .catch((error) => {
        console.error(error);
        resolve("");
      });
  });
}
