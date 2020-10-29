import { ValueOf } from "../../../../types/utils";

export const ItemFocusTriggers = {
  "Click target": 1,
  "Hover target": 2,
  "Click Next button": 3,
  None: null,
};

export const ItemAudioTriggers = {
  "Audio finish": 1,
  "Click Next button": 2,
  None: null,
};

export const ItemImageTriggers = {
  "Click Ok button": 1,
  "Click Next button": 2,
  None: null,
};

export const ItemVideoTriggers = {
  "Click Ok button": 1,
  "On video end": 2,
  "Click Next button": 3,
  None: null,
};

export const ItemDialogTriggers = {
  "Click Ok button": 1,
  "On video end": 2,
  "Click Next button": 3,
  None: null,
};

export interface IAbsolutePos {
  vertical?: number; // In % of screen, not used for anchors
  horizontal?: number; // In % of screen, not used for anchors
  x: number;
  y: number;
  width: number;
  height: number;
}

export type BaseItemType =
  | "focus_highlight"
  | "audio"
  | "video"
  | "image"
  | "dialog";

export interface BaseItem {
  _id: string;
  name: string;
  type: BaseItemType;
  relativePos: IAbsolutePos;
  trigger: number | null;
  destination: string; // a step ID to go to
  transition: number; // type
}

export interface ItemFocus extends BaseItem {
  type: "focus_highlight";
  focus: "Mouse Point" | "Rectangle" | "Area highlight";
  trigger: ValueOf<typeof ItemFocusTriggers>;
}

export interface ItemAudio extends BaseItem {
  type: "audio";
  showPopup: boolean;
  url: string;
  text: string;
  trigger: ValueOf<typeof ItemAudioTriggers>;
}

export interface ItemImage extends BaseItem {
  type: "image";
  url: string;
  trigger: ValueOf<typeof ItemImageTriggers>;
}

export interface ItemVideo extends BaseItem {
  type: "video";
  url: string;
  loop: boolean;
  trigger: ValueOf<typeof ItemVideoTriggers>;
}

export interface ItemDialog extends BaseItem {
  type: "dialog";
  url: string;
  trigger: ValueOf<typeof ItemDialogTriggers>;
}

export type Item = ItemFocus | ItemAudio | ItemImage | ItemVideo | ItemDialog;
