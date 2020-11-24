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

interface Contour {
  top_left_corner: Array<number>;
  top_right_corner: Array<number>;
  bottom_left_corner: Array<number>;
  bottom_right_corner: Array<number>;
}

export interface StepData {
  type: StepType;
  name: string;
  x_cordinate?: number;
  y_cordinate?: number;
  time_stamp: string;
  process_owner: string;
  process_title: string;
  process_url: string;
  click_type: string;
  contours: Contour;
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
  spectrum: number[];
  step_data: StepData[];
}
