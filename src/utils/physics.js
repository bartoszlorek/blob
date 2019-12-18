import {EDGE_CYCLE} from '@physics/consts';
import {modIndex} from '@utils/math';

export function rotateEdge(origin, edge) {
  let shift = 0;

  if (origin[0] < 0) {
    shift = 1;
  } else if (origin[1] < 0) {
    shift = 2;
  } else if (origin[0] > 0) {
    shift = 3;
  }

  const index = EDGE_CYCLE.indexOf(edge);
  return EDGE_CYCLE[modIndex(index - shift, 4)];
}

export function rotateVector(origin, vector) {
  const [x, y] = vector;

  if (origin[1] < 0) {
    vector[0] = -x;
    vector[1] = -y;
  } else if (origin[0] > 0) {
    vector[0] = y;
    vector[1] = -x;
  } else if (origin[0] < 0) {
    vector[0] = -y;
    vector[1] = x;
  }
  return vector;
}

export function vectorRotation(vector) {
  if (vector[1] < 0) {
    return Math.PI;
  }
  if (vector[0] > 0) {
    return (3 * Math.PI) / 2;
  }
  if (vector[0] < 0) {
    return Math.PI / 2;
  }
  return 0;
}
