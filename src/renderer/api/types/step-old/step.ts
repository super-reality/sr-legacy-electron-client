export interface IStep {
  index?: number;
  images: string[];
  functions: number[];
  name: string;
  trigger: number;
  description: string;
  next: number;
  cvMatchValue: number;
  cvCanvas: number;
  cvDelay: number;
  cvGrayscale: boolean;
  cvApplyThreshold: boolean;
  cvThreshold: number;
}
