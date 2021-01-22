import { EndStepTypeValue } from "./endStep";

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
  // trigger: number | null;
  destination: string; // a step ID to go to
  transition: number; // type
  anchor: boolean;
  endOn: EndStepTypeValue[];
}

export interface ItemFocus extends BaseItem {
  type: "focus_highlight";
  focus: "Mouse Point" | "Rectangle" | "Area highlight";
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
}

export interface ItemImage extends BaseItem {
  type: "image";
  url: string;
}

export interface ItemVideo extends BaseItem {
  type: "video";
  url: string;
  loop: boolean;
  muted?: boolean;
}

export interface ItemYoutube extends BaseItem {
  type: "youtube";
  url: string;
}

export interface ItemDialog extends BaseItem {
  type: "dialog";
  text: string;
}

export type Item =
  | ItemFocus
  | ItemAudio
  | ItemImage
  | ItemVideo
  | ItemYoutube
  | ItemDialog
  | ItemFX;
