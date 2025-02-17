import type { MaybeArray } from '../types';

export const toArray = <T>(value?: MaybeArray<T>): T[] => {
  return value ? (Array.isArray(value) ? value : [value]) : [];
};
