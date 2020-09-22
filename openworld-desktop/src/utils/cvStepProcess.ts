import {
  InitalFnOptions,
  IStep,
  NextStepOptions,
} from "../renderer/api/types/step/step";
import createFindBox from "./createFindBox";

export default function cvStepProcess(
  res: any,
  stepNow: IStep
  doNext?: () => void,
) {
  if (stepNow?.next == NextStepOptions["On Target Detected"]) {
    if (doNext) {
      doNext();
      return;
    }
  }
  const findProps = {
    closeOnClick: stepNow?.next == NextStepOptions["On Target Clicked"],
    opacity:
      stepNow?.functions[0] == InitalFnOptions["Computer vision On"] ? 1 : 0,
  };
  if (stepNow?.functions[0] !== InitalFnOptions["Computer vision Off"]) {
    createFindBox(res, findProps).then((findResult) => {
      if (doNext && (findResult == "Focused" || findResult == "Clicked")) {
        doNext();
      }
    });
  }
}
