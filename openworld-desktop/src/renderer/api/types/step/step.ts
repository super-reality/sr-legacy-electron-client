import constants from "../../constant";

export const InitalFnOptions = {
  "Computer vision On": constants.Image_Function.Computer_Vision_On,
  "Computer vision On but invisible":
    constants.Image_Function.Computer_Vision_On_But_Visible,
  "Computer vision Off": constants.Image_Function.Computer_Vision_Off,
};

export const FnOptions = {
  And: constants.Image_Function_Additional.And,
  Or: constants.Image_Function_Additional.Or,
  Ignore: constants.Image_Function_Additional.Ignore,
};

export const TriggerOptions = {
  "On Step loaded": constants.Step_Trigger.On_Step_Loaded,
  "On Focus detected": constants.Step_Trigger.On_Focus_Detected,
  "On Gaze detected": constants.Step_Trigger.On_Gaze_Detected,
  "On Highlight clicked": constants.Step_Trigger.On_Highlight_Clicked,
};

export const NextStepOptions = {
  "Press Next Step": constants.Next_Step.Press_Next_Step_Button,
  "On Highlight Clicked": constants.Next_Step.On_Highlight_Clicked,
  "On text reading finished": constants.Next_Step.On_Text_Reading_Finished,
};

export interface ICVFn {
  image: string;
  function: number;
}

export interface IStep {
  image: string;
  imageFunction: number;
  additionalFunctions: ICVFn[];
  name: string;
  trigger: number;
  description: string;
  next: number;
}
