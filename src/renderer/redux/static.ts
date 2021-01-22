/* eslint-disable import/prefer-default-export */

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
  cvTo: "",
  anchorId: "",
};

export { initialCVSettings, initialBackgroundState };
