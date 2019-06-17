import {arrayForEach, arrayReduce} from '@utils/array';

const initialBounds = () => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
});

function baseBounds(elements, bounds) {
  const result = bounds || initialBounds();

  arrayForEach(elements, elem => {
    if (elem.left < result.left) {
      result.left = elem.left;
    } else if (elem.right > result.right) {
      result.right = elem.right;
    }

    if (elem.top < result.top) {
      result.top = elem.top;
    } else if (elem.bottom > result.bottom) {
      result.bottom = elem.bottom;
    }
  });

  return result;
}

export function createBounds(elements) {
  return baseBounds(elements);
}

export function mergeBounds(first, ...bounds) {
  const iteratee = (result, values) => baseBounds(values, result);
  return arrayReduce(bounds, iteratee, {...first});
}
