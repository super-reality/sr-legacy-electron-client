import { IDName } from "..";
import { TypeValue } from "../../../../types/utils";

type CanvasTypes = "url" | "recording" | "image";

interface BaseCanvasTypeValue {
  type: CanvasTypes;
}

export interface UrlCanvasTypeValue extends BaseCanvasTypeValue {
  type: "url";
  value: string;
}

export interface RecordingCanvasTypeValue extends BaseCanvasTypeValue {
  type: "recording";
  value: {
    recording: string;
    timestamp: string;
    url: string;
  };
}

export interface ImageCanvasTypeValue extends BaseCanvasTypeValue {
  type: "image";
  value: {
    filename: string;
    url: string;
  };
}

export type CanvasTypeValue =
  | UrlCanvasTypeValue
  | RecordingCanvasTypeValue
  | ImageCanvasTypeValue;

export interface IStep {
  _id: string;
  name: string;
  summary: string;
  startWhen: TypeValue[];
  canvas: CanvasTypeValue[];
  anchor: string | null;
  items: IDName[];
  // recordingId?: string;
  // recordingTimestamp?: string;
  // snapShot?: string;
}
