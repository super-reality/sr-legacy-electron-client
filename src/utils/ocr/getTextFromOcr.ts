import getImageForOcr from "./getImageForOcr";
import OcrService from "./ocrService";

export default function getTextFromOcr(
  language: string,
  imageUrl: string
): Promise<string> {
  return new Promise((resolve) => {
    const ocrService = new OcrService();
    ocrService
      .initialize(language)
      .then(() => {
        getImageForOcr(imageUrl).then((imgBuffer) => {
          resolve(ocrService.getText(imgBuffer));
        });
      })
      .catch((error) => {
        console.error(error);
        resolve("");
      });
  });
}
