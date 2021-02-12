/* eslint-env jest */
import constant from "../../constant";
import { DifficultyOptions, EntryOptions } from "../lesson/lesson";

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
