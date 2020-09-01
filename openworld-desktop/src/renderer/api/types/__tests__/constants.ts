/* eslint-env jest */
import constant from "../../constant";
import { DifficultyOptions, EntryOptions } from "../lesson/lesson";
import {
  InitalFnOptions,
  FnOptions,
  NextStepOptions,
  TriggerOptions,
} from "../step/step";

test("Constants were not added", () => {
  expect(Object.keys(constant).length).toBe(12);
});

test("Lesson constants are updated", () => {
  expect(Object.keys(DifficultyOptions).sort()).toStrictEqual(
    Object.keys(constant.Difficulty).sort()
  );

  expect(Object.keys(EntryOptions).sort()).toStrictEqual(
    Object.keys(constant.Entry).sort()
  );
});

test("Step constants are updated", () => {
  expect(Object.values(InitalFnOptions).sort()).toStrictEqual(
    Object.values(constant.Image_Function).sort()
  );

  expect(Object.values(FnOptions).sort()).toStrictEqual(
    Object.values(constant.Image_Function_Additional).sort()
  );

  expect(Object.values(NextStepOptions).sort()).toStrictEqual(
    Object.values(constant.Next_Step).sort()
  );

  expect(Object.values(TriggerOptions).sort()).toStrictEqual(
    Object.values(constant.Step_Trigger).sort()
  );
});
