/* eslint-disable import/prefer-default-export */

const initialCVSettings = {
  cvMatchValue: 990,
  cvCanvas: 50,
  cvDelay: 100,
  cvGrayscale: true as boolean,
  cvApplyThreshold: false as boolean,
  cvThreshold: 127,
};

const initialBackgroundState = {
  cvTemplates: [] as string[],
  cvTo: "",
};

export { initialCVSettings, initialBackgroundState };
