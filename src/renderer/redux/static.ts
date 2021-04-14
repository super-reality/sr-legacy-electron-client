/* eslint-disable import/prefer-default-export */

import { CVTypes } from "../../types/utils";

const initialCVSettings = {
  cvMatchValue: 990,
  cvCanvas: 100,
  cvDelay: 50,
  cvGrayscale: true as boolean,
  cvApplyThreshold: false as boolean,
  cvThreshold: 127,
};

const initialBackgroundState = {
  cvTemplates: [] as string[],
  cvType: "template" as CVTypes,
  cvTo: "",
  anchorId: "",
};

export { initialCVSettings, initialBackgroundState };
