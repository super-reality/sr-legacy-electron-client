import { TypeValue } from "../../types/utils";

export type TriggerTypes =
  | "mouse-left"
  | "mouse-double"
  | "mouse-hover"
  | "gaze"
  | "keyboard";

interface BaseEndStepTypeValue extends TypeValue {
  type: TriggerTypes;
}

export interface MouseLeftTriggerTypeValue extends BaseEndStepTypeValue {
  type: "mouse-left";
  value: string;
}

export interface MouseDoubleTriggerTypeValue extends BaseEndStepTypeValue {
  type: "mouse-double";
  value: string;
}

export interface MouseHoverTriggerTypeValue extends BaseEndStepTypeValue {
  type: "mouse-hover";
  value: string;
}

export interface GazeTriggerTypeValue extends BaseEndStepTypeValue {
  type: "gaze";
  value: string;
}

export interface KeyboardTriggerTypeValue extends BaseEndStepTypeValue {
  type: "keyboard";
  value: string;
}

export type EndStepTypeValue =
  | MouseLeftTriggerTypeValue
  | MouseDoubleTriggerTypeValue
  | MouseHoverTriggerTypeValue
  | GazeTriggerTypeValue
  | KeyboardTriggerTypeValue;
