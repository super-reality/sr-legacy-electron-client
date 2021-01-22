/* eslint-env jest */
import { mode1, mode2, mode3 } from "./modes";
import { DiscreteScale } from "../scales/DiscreteScale";
import { HandleItem } from "../types";

describe("modes", () => {
  let min: number;
  let max: number;
  let step: number;
  let scale: DiscreteScale;

  beforeEach(() => {
    min = 0;
    max = 100;
    step = 5;

    scale = new DiscreteScale();
    scale.setStep(step).setRange([min, max]).setDomain([min, max]);
  });

  describe("mode1", () => {
    it("should just return the next items", () => {
      const prev: HandleItem[] = [];
      const next: HandleItem[] = [];

      const result = mode1(prev, next);
      expect(result).toBe(next);
    });
  });
  describe("mode2", () => {
    it("should return prev if key order has changed", () => {
      const prev = [
        { key: "key-1", val: 100 },
        { key: "key-2", val: 200 },
      ];
      const next = prev.slice().reverse();

      const result = mode2(prev, next);
      expect(result).toBe(prev);
    });
    it("should return prev if the change would result in two keys with same value", () => {
      const prev1 = [
        { key: "key-1", val: 100 },
        { key: "key-2", val: 200 },
      ];
      const next1 = [
        { key: "key-1", val: 100 },
        { key: "key-2", val: 100 },
      ];

      expect(mode2(prev1, next1)).toBe(prev1);

      const prev2 = [
        { key: "key-1", val: 100 },
        { key: "key-2", val: 200 },
        { key: "key-3", val: 300 },
      ];
      const next2 = [
        { key: "key-1", val: 100 },
        { key: "key-2", val: 100 },
        { key: "key-3", val: 300 },
      ];

      expect(mode2(prev2, next2)).toBe(prev2);
    });
    it("should return next if values are different and they would NOT change order", () => {
      const prev1 = [
        { key: "key-1", val: 100 },
        { key: "key-2", val: 200 },
      ];
      const next1 = [
        { key: "key-1", val: 100 },
        { key: "key-2", val: 300 },
      ];

      expect(mode2(prev1, next1)).toBe(next1);
    });
  });
  describe("mode3", () => {
    it("should move the other value by a step if there is a conflict", () => {
      const prev = [
        { key: "key-1", val: 50 },
        { key: "key-2", val: 75 },
      ];
      const next = [
        { key: "key-1", val: 75 },
        { key: "key-2", val: 75 },
      ];

      const result = mode3(prev, next, step, false, scale.getValue);
      expect(result[1].val).toBe(prev[1].val + step);
    });
    it("should move the other value in the correct direction", () => {
      const prev = [
        { key: "key-1", val: 50 },
        { key: "key-2", val: 75 },
      ];
      const next = [
        { key: "key-1", val: 50 },
        { key: "key-2", val: 50 },
      ];

      const result = mode3(prev, next, step, false, scale.getValue);
      expect(result[0].val).toBe(prev[0].val - step);
    });
    it("should also clear any conflicts created by the first move", () => {
      const prev = [
        { key: "key-1", val: 45 },
        { key: "key-2", val: 50 },
        { key: "key-3", val: 75 },
      ];
      const next = [
        { key: "key-1", val: 45 },
        { key: "key-2", val: 50 },
        { key: "key-3", val: 50 },
      ];

      const result = mode3(prev, next, step, false, scale.getValue);

      expect(result[1].val).toBe(prev[1].val - step);
      expect(result[0].val).toBe(prev[0].val - step);
    });
    it("should return the current state if all conflicts cannot be resolved", () => {
      const reversed = false;

      const prev = [
        { key: "key-6", val: 0 },
        { key: "key-5", val: 5 },
        { key: "key-4", val: 10 },
        { key: "key-3", val: 15 },
        { key: "key-2", val: 20 },
        { key: "key-1", val: 25 },
      ];
      const next = [
        { key: "key-6", val: 0 },
        { key: "key-5", val: 5 },
        { key: "key-4", val: 10 },
        { key: "key-3", val: 15 },
        { key: "key-2", val: 20 },
        { key: "key-1", val: 20 },
      ];

      const result = mode3(prev, next, step, reversed, scale.getValue);

      expect(result).toBe(prev);
    });
    it("should return the current state if reversed === true if all conflicts cannot be resolved", () => {
      const reversed = true;

      const prev = [
        { key: "key-1", val: 25 },
        { key: "key-2", val: 20 },
        { key: "key-3", val: 15 },
        { key: "key-4", val: 10 },
        { key: "key-5", val: 5 },
        { key: "key-6", val: 0 },
      ];
      const next = [
        { key: "key-1", val: 20 },
        { key: "key-2", val: 20 },
        { key: "key-3", val: 15 },
        { key: "key-4", val: 10 },
        { key: "key-5", val: 5 },
        { key: "key-6", val: 0 },
      ];

      const result = mode3(prev, next, step, reversed, scale.getValue);

      expect(result).toBe(prev);
    });
    it("should resolve correctly this chain of changes", () => {
      const reversed = true;

      const prev = [
        { key: "key-1", val: 30 },
        { key: "key-2", val: 25 },
        { key: "key-3", val: 20 },
        { key: "key-4", val: 15 },
        { key: "key-5", val: 10 },
        { key: "key-6", val: 5 },
      ];
      const next = [
        { key: "key-1", val: 25 },
        { key: "key-2", val: 25 },
        { key: "key-3", val: 20 },
        { key: "key-4", val: 15 },
        { key: "key-5", val: 10 },
        { key: "key-6", val: 5 },
      ];

      const result = mode3(prev, next, step, reversed, scale.getValue);

      expect(result[0].val).toBe(25);
      expect(result[1].val).toBe(20);
      expect(result[2].val).toBe(15);
      expect(result[3].val).toBe(10);
      expect(result[4].val).toBe(5);
      expect(result[5].val).toBe(0);
    });
  });
});
