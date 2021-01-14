import { TypeValue } from "../../types/utils";

export type TriggerTypes = "mouse" | "gaze" | "keyboard";

interface BaseEndStepTypeValue extends TypeValue {
  type: TriggerTypes;
}

export interface MouseTriggerTypeValue extends BaseEndStepTypeValue {
  type: "mouse";
  value: "left" | "double" | "hover";
}

export interface GazeTriggerTypeValue extends BaseEndStepTypeValue {
  type: "gaze";
  value: null;
}

export interface KeyboardTriggerTypeValue extends BaseEndStepTypeValue {
  type: "keyboard";
  value: string;
}

export type EndStepTypeValue =
  | MouseTriggerTypeValue
  | GazeTriggerTypeValue
  | KeyboardTriggerTypeValue;
