/* eslint-env jest */
import { DiscreteScale } from './DiscreteScale';

const getTestValues = (min = 0, max = 10) => {
  return {
    range: [min, max],
    domain: [min, max],
  };
};

describe('DiscreteScale', () => {
  let scale: DiscreteScale;

  beforeEach(() => {
    scale = new DiscreteScale();
  });

  it('should return correct values', () => {
    const { range, domain } = getTestValues();
    scale.setRange(range).setDomain(domain);
    expect(scale.getValue(5.4)).toBe(5);
    expect(scale.getValue(0.4)).toBe(0);
    expect(scale.getValue(5.5)).toBe(6);
  });
});
