import fs from "fs";

export default function saveCanvasImage(
  fileName: string,
  canvasElement?: HTMLCanvasElement
): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = canvasElement;
    if (!canvas) {
      canvas = document.getElementById("preview-video-canvas") as
        | HTMLCanvasElement
        | undefined;
    }
    if (canvas) {
      const url = canvas.toDataURL("image/jpg", 0.8);

      // remove Base64 stuff from the Image
      const base64Data = url.replace(/^data:image\/png;base64,/, "");
      fs.writeFile(fileName, base64Data, "base64", (err: any) => {
        if (err) reject(err);
        else {
          resolve(fileName);
        }
      });
    } else {
      reject();
    }
  });
}
