import {raycast} from './raycast';
import {createPool} from '@utils/object';
import Vector from '@models/Vector';

export const SOLID_SOLID = Symbol('solid-solid');
export const SOLID_BORDER = Symbol('solid-border');
export const BORDER_BORDER = Symbol('border-border');

const ray = createPool({
  type: '',
  distance: 0,
  direction: new Vector()
});

export function calculateGravity(entity, objects) {
  const outside = outsideBounds(entity, objects);

  if (outside) {
    return outside;
  }
  // corner case outside bounds
  // should use last known gravity
  if (outside === null) {
    return null;
  }

  const closestSolids = getClosestSolids(entity, objects);

  // corner case inside bounds
  if (isCornerCase(closestSolids)) {
    return null;
  }

  const top = raycast(ray(0), objects, entity, 0, -1);
  const right = raycast(ray(1), objects, entity, 1, 0);
  const bottom = raycast(ray(2), objects, entity, 0, 1);
  const left = raycast(ray(3), objects, entity, -1, 0);

  const y = sortPair(top, bottom);
  const x = sortPair(left, right);

  // artificial gravity in the cave
  if (x.type === SOLID_SOLID && y.type === SOLID_SOLID) {
    return new Vector(0, 1);
  }

  // common cases
  if (x.type === SOLID_BORDER && y.type === SOLID_BORDER) {
    if (x[0].distance < y[0].distance) {
      return x[0].direction;
    }
    if (x[0].distance > y[0].distance) {
      return y[0].direction;
    }
    return null;
  }

  if (x.type === SOLID_SOLID && y.type === SOLID_BORDER) {
    const closestSolid = getClosestRay(x[0], x[1], y[0]);
    return closestSolid ? closestSolid.direction : null;
  }

  if (x.type === SOLID_BORDER && y.type === SOLID_SOLID) {
    const closestSolid = getClosestRay(x[0], y[0], y[1]);
    return closestSolid ? closestSolid.direction : null;
  }

  // gap cases
  if (x.type === SOLID_BORDER && y.type === BORDER_BORDER) {
    return x[0].direction;
  }

  if (x.type === BORDER_BORDER && y.type === SOLID_BORDER) {
    return y[0].direction;
  }

  if (x.type === SOLID_SOLID && y.type === BORDER_BORDER) {
    if (x[0].distance < x[1].distance) {
      return x[0].direction;
    }
    if (x[0].distance > x[1].distance) {
      return x[1].direction;
    }
    return new Vector(-1, 0);
  }

  if (x.type === BORDER_BORDER && y.type === SOLID_SOLID) {
    if (y[0].distance < y[1].distance) {
      return y[0].direction;
    }
    if (y[0].distance > y[1].distance) {
      return y[1].direction;
    }
    return new Vector(0, 1);
  }
}

function outsideBounds(entity, objects) {
  // todo: handle multiple objects
  const object = objects[0];

  // corners
  if (
    (entity.bottom < object.bounds.top && entity.right < object.bounds.left) ||
    (entity.bottom < object.bounds.top && entity.left > object.bounds.right) ||
    (entity.top > object.bounds.bottom && entity.right < object.bounds.left) ||
    (entity.top > object.bounds.bottom && entity.left > object.bounds.right)
  ) {
    return null;
  }

  // straight
  if (entity.bottom <= object.bounds.top) {
    return new Vector(0, 1);
  }
  if (entity.top >= object.bounds.bottom) {
    return new Vector(0, -1);
  }
  if (entity.right <= object.bounds.left) {
    return new Vector(1, 0);
  }
  if (entity.left >= object.bounds.right) {
    return new Vector(-1, 0);
  }
}

function isCornerCase(matrix) {
  return (
    (matrix[6] && !matrix[3] && !matrix[7]) || // bottom-left
    (matrix[8] && !matrix[5] && !matrix[7]) || // bottom-right
    (matrix[0] && !matrix[3] && !matrix[1]) || // top-left
    (matrix[2] && !matrix[5] && !matrix[1]) //    top-right
  );
}

export function getClosestSolids(entity, objects) {
  // todo: handle multiple objects
  return objects[0].closest(entity.gridX, entity.gridY);
}

export function getClosestRay(...rays) {
  let last = rays[0] || null;

  for (let i = 1; i < rays.length; i++) {
    const ray = rays[i];

    if (ray.distance === last.distance) {
      return null;
    }
    if (ray.distance < last.distance) {
      last = ray;
    }
  }
  return last;
}

export function sortPair(a, b) {
  const pair = [];

  if (a.type === 'solid') {
    pair.type = b.type === 'solid' ? SOLID_SOLID : SOLID_BORDER;
    pair.push(a, b);
  } else {
    pair.type = b.type === 'solid' ? SOLID_BORDER : BORDER_BORDER;
    pair.push(b, a);
  }
  return pair;
}
