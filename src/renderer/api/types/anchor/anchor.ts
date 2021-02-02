export type AnchorType = "record" | "crop" | "url";

export type AnchorFn = "or" | "and";

export interface IAnchor {
  _id: string;
  name: string;
  type: AnchorType;
  templates: string[];
  anchorFunction: AnchorFn;
  cvMatchValue: number;
  cvCanvas: number;
  cvDelay: number;
  cvGrayscale: boolean;
  cvApplyThreshold: boolean;
  cvThreshold: number;
}
