import {utils} from 'pixi.js';

export function arrayForEach(array, iteratee) {
  for (let index = 0; index < array.length; index++) {
    if (iteratee(array[index], index, array) === false) {
      return;
    }
  }
}

export function arrayMap(array, predicate) {
  const result = [];
  for (let index = 0; index < array.length; index++) {
    result[index] = predicate(array[index], index, array);
  }
  return result;
}

export function arrayFilter(array, predicate) {
  const result = [];
  for (let index = 0; index < array.length; index++) {
    if (predicate(array[index], index, array) !== false) {
      result.push(array[index]);
    }
  }
  return result;
}

export function arrayReduce(array, iteratee, initialValue) {
  let result = initialValue;
  for (let index = 0; index < array.length; index++) {
    result = iteratee(result, array[index], index, array);
  }
  return result;
}

export function isEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let index = 0; index < array1.length; index++) {
    if (array1[index] !== array2[index]) {
      return false;
    }
  }
  return true;
}

export function arrayRemove(array, item) {
  const index = array.indexOf(item);

  if (index !== -1) {
    utils.removeItems(array, index, 1);
  }
}

export function mergeArrays(array1, array2) {
  Array.prototype.push.apply(array1, array2);
  return array1;
}
