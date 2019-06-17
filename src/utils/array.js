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
