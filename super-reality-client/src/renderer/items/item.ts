import { ValueOf } from "../../types/utils";

export const ItemFocusTriggers = {
  "Click target": 1,
  "Hover target": 2,
  "Target found": 4,
  None: null,
};

export const ItemAudioTriggers = {
  "Audio finish": 1,
  None: null,
};

export const ItemImageTriggers = {
  "Click Ok button": 1,
  None: null,
};

export const ItemVideoTriggers = {
  "Click Ok button": 1,
  "On video end": 2,
  None: null,
};

export const ItemYoutubeTriggers = {
  "Click Ok button": 1,
  None: null,
};

export const ItemDialogTriggers = {
  "Click Ok button": 1,
  None: null,
};

export const ItemFXTriggers = {
  "On fx end": 1,
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
  | "youtube"
  | "image"
  | "dialog"
  | "fx";

export interface BaseItem {
  _id: string;
  name: string;
  type: BaseItemType;
  relativePos: IAbsolutePos;
  trigger: number | null;
  destination: string; // a step ID to go to
  transition: number; // type
  anchor: boolean;
}

export interface ItemFocus extends BaseItem {
  type: "focus_highlight";
  focus: "Mouse Point" | "Rectangle" | "Area highlight";
  trigger: ValueOf<typeof ItemFocusTriggers>;
}

export interface ItemFX extends BaseItem {
  type: "fx";
  effect: string;
  fullScreen: boolean;
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

export interface ItemYoutube extends BaseItem {
  type: "youtube";
  url: string;
  trigger: ValueOf<typeof ItemYoutubeTriggers>;
}

export interface ItemDialog extends BaseItem {
  type: "dialog";
  text: string;
  trigger: ValueOf<typeof ItemDialogTriggers>;
}

export type Item =
  | ItemFocus
  | ItemAudio
  | ItemImage
  | ItemVideo
  | ItemYoutube
  | ItemDialog
  | ItemFX;
