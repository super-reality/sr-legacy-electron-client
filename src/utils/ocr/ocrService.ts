import {
  ConfigResult,
  createWorker,
  ImageLike,
  RecognizeResult,
  Worker,
} from "tesseract.js";
import { ocrCachePath } from "../../renderer/electron-constants";

class OcrService {
  worker: Worker;

  constructor() {
    this.worker = createWorker({
      cachePath: ocrCachePath,
    });
  }

  async initialize(language: string): Promise<ConfigResult> {
    await this.worker.load();
    await this.worker.loadLanguage(language);
    const configResult = await this.worker.initialize(language);
    return configResult;
  }

  getResult(imageLike: ImageLike): Promise<RecognizeResult> {
    return this.worker.recognize(imageLike);
  }

  async getText(imageLike: ImageLike): Promise<string> {
    const result = await this.worker.recognize(imageLike);
    return result.data.text;
  }
}

export default OcrService;
