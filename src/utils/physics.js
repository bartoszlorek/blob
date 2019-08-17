import {modIndex} from '@utils/math';
import {EDGE} from '@physics/World';

const edgeValues = Object.values(EDGE);

export function rotateEdge(gravity, edge) {
  let shift = 0;

  if (gravity.direction.x < 0) {
    shift = 1;
  } else if (gravity.direction.y < 0) {
    shift = 2;
  } else if (gravity.direction.x > 0) {
    shift = 3;
  }
  const index = edgeValues.indexOf(edge);
  return edgeValues[modIndex(index - shift, 4)];
}

export function rotateVector(gravity, vec) {
  const {x, y} = vec;

  if (gravity.direction.y < 0) {
    vec.x = -x;
    vec.y = -y;
  } else if (gravity.direction.x > 0) {
    vec.x = y;
    vec.y = -x;
  } else if (gravity.direction.x < 0) {
    vec.x = -y;
    vec.y = x;
  }
  return vec;
}

export function vectorRotation(gravity) {
  if (gravity.direction.y < 0) {
    return Math.PI;
  }
  if (gravity.direction.x > 0) {
    return (3 * Math.PI) / 2;
  }
  if (gravity.direction.x < 0) {
    return Math.PI / 2;
  }
  return 0;
}
