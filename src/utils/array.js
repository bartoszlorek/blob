// @flow strict

import {utils} from 'pixi.js';

export function arrayRemove<T>(array: Array<T>, item: T) {
  const index = array.indexOf(item);

  if (index !== -1) {
    utils.removeItems(array, index, 1);
  }
}

export function mergeArrays<T>(array1: Array<T>, array2: Array<T>) {
  Array.prototype.push.apply(array1, array2);
  return array1;
}
