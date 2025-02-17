import { describe, expect, it } from 'vitest';

import { toArray } from './to-array';

describe('toArray', () => {
  it('should return an empty array when value is undefined', () => {
    expect(toArray()).toEqual([]);
  });

  it('should return the value when value is an array', () => {
    const value = [1, 2, 3];

    expect(toArray(value)).toBe(value);
  });

  it('should return an array with a single element when value is not an array', () => {
    const value = 1;

    expect(toArray(value)).toEqual([value]);
  });
});
