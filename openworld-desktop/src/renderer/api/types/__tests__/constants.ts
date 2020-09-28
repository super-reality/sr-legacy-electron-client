/* eslint-env jest */
import constant from "../../constant";
import { DifficultyOptions, EntryOptions } from "../lesson/lesson";
import {
  InitalFnOptions,
  FnOptions,
  NextStepOptions,
  TriggerOptions,
} from "../step/step";
import { LessonSortOptions } from "../lesson/search";
import { SubjectSortOptions } from "../subject/search";

test("Constants were not added", () => {
  expect(Object.keys(constant).length).toBe(15);
});

test("Lesson constants are updated", () => {
  expect(Object.keys(DifficultyOptions).sort()).toStrictEqual(
    Object.keys(constant.Difficulty).sort()
  );

  expect(Object.keys(EntryOptions).sort()).toStrictEqual(
    Object.keys(constant.Entry).sort()
  );

  expect(Object.values(LessonSortOptions).sort()).toStrictEqual(
    Object.values(constant.Lesson_Sort).sort()
  );

  expect(Object.values(SubjectSortOptions).sort()).toStrictEqual(
    Object.values(constant.Subject_Sort).sort()
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
