/* eslint-disable camelcase */

export type StepType =
  | "left_click"
  | "right_click"
  | "wheel_click"
  | "left_release"
  | "right_release"
  | "wheel_release"
  | "scroll_down"
  | "scroll_up"
  | "keydown"
  | "keyup";

export interface StepData {
  type: StepType;
  name: string;
  x_cordinate?: number;
  y_cordinate?: number;
  time_stamp: string;
  keyboard_events: {
    shiftKey?: boolean;
    altKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    keycode?: number;
    rawcode?: number;
    type?: "keydown" | "keyup";
  };
}

export interface RecordingJson {
  anchor?: string;
  step_data: StepData[];
}
