import {arrayReduce} from '@utils/array';
import {createRaycast, originFromEntity} from './raycast';
import Vector from '@models/Vector';
import Matrix from '@models/Matrix';

export const SOLID_SOLID = Symbol('solid-solid');
export const SOLID_BORDER = Symbol('solid-border');
export const BORDER_BORDER = Symbol('border-border');

export function calculateGravity({entity, solids, bounds}) {
  const outside = outsideBounds(entity, bounds);

  if (outside) {
    return outside;
  }
  // corner case outside bounds
  // should use last known gravity
  if (outside === null) {
    return null;
  }

  const closestSolids = getClosestSolids(entity, solids);

  // corner case inside bounds
  if (isCornerCase(closestSolids)) {
    return null;
  }

  const border = bounds.toBorder();
  const origin = originFromEntity(entity);

  const raycast = createRaycast(solids, border);
  const top = raycast(origin, new Vector(0, -1));
  const right = raycast(origin, new Vector(1, 0));
  const bottom = raycast(origin, new Vector(0, 1));
  const left = raycast(origin, new Vector(-1, 0));

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

function outsideBounds(entity, bounds) {
  // corners
  if (
    (entity.bottom < bounds.top && entity.right < bounds.left) ||
    (entity.bottom < bounds.top && entity.left > bounds.right) ||
    (entity.top > bounds.bottom && entity.right < bounds.left) ||
    (entity.top > bounds.bottom && entity.left > bounds.right)
  ) {
    return null;
  }

  // straight
  if (entity.bottom <= bounds.top) {
    return new Vector(0, 1);
  }
  if (entity.top >= bounds.bottom) {
    return new Vector(0, -1);
  }
  if (entity.right <= bounds.left) {
    return new Vector(1, 0);
  }
  if (entity.left >= bounds.right) {
    return new Vector(-1, 0);
  }
}

function isCornerCase(mat) {
  return (
    (mat.n(2, 0) && !mat.n(1, 0) && !mat.n(2, 1)) || // top-right
    (mat.n(2, 2) && !mat.n(2, 1) && !mat.n(1, 2)) || // bottom-right
    (mat.n(0, 2) && !mat.n(1, 2) && !mat.n(0, 1)) || // bottom-left
    (mat.n(0, 0) && !mat.n(0, 1) && !mat.n(1, 0)) // top-left
  );
}

export function getClosestSolids(entity, solids) {
  const fn = (mat, solid) => mat.merge(solid.closest(entity, 1));
  return arrayReduce(solids, fn, new Matrix(3, 3));
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
