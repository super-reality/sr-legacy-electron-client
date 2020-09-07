import constant from "../../constant";

export const InitalFnOptions = {
  "Computer vision On": constant.Image_Function.Computer_Vision_On,
  "Computer vision On (Invisible)":
    constant.Image_Function.Computer_Vision_On_But_Visible,
  "Computer vision Off": constant.Image_Function.Computer_Vision_Off,
};

export const FnOptions = {
  And: constant.Image_Function_Additional.And,
  Or: constant.Image_Function_Additional.Or,
  Ignore: constant.Image_Function_Additional.Ignore,
};

export const TriggerOptions = {
  None: constant.Step_Trigger.None,
  "On Step loaded": constant.Step_Trigger.On_Step_Loaded,
  "On Focus detected": constant.Step_Trigger.On_Focus_Detected,
  "On Gaze detected": constant.Step_Trigger.On_Gaze_Detected,
  "On Highlight clicked": constant.Step_Trigger.On_Highlight_Clicked,
};

export const NextStepOptions = {
  "Press Next Step": constant.Next_Step.Press_Next_Step_Button,
  "On Highlight Clicked": constant.Next_Step.On_Highlight_Clicked,
  "On text reading finished": constant.Next_Step.On_Text_Reading_Finished,
};

export interface IStep {
  index?: number;
  images: string[];
  functions: number[];
  name: string;
  trigger: number;
  description: string;
  next: number;
}
