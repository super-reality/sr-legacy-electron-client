/* eslint-env jest */
import LinearScale from "./LinearScale";

describe("LinearScale", () => {
  let scale: LinearScale;

  beforeEach(() => {
    scale = new LinearScale();
  });

  it("should return correct values", () => {
    scale.setDomain([0, 100]).setRange([0, 1]);
    expect(scale.getValue(50)).toBe(0.5);
  });

  it("should handle reversed domains", () => {
    scale.setDomain([100, 0]).setRange([0, 1]);
    expect(scale.getValue(75)).toBe(0.25);
  });

  it("should return the correct number of ticks", () => {
    scale.setDomain([0, 1000]).setRange([0, 100]);
    expect(scale.getTicks(3).length).toBe(3);
  });
});
