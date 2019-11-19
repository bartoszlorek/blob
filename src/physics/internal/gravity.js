import Ray from './Ray';
import CompoundRay, {COMPOUND_TYPE} from './CompoundRay';
import {outsideVector, isCornerCase} from './helpers';

const rayTop = new Ray(0, -1);
const rayRight = new Ray(1, 0);
const rayBottom = new Ray(0, 1);
const rayLeft = new Ray(-1, 0);

const y = new CompoundRay(rayTop, rayBottom);
const x = new CompoundRay(rayLeft, rayRight);

export function calculateGravity(body, tilemap) {
  const outside = outsideVector(body, tilemap);

  if (outside) {
    return outside;
  }
  // corner case outside bounds
  // should use last known gravity
  if (outside === null) {
    return null;
  }

  const {tileX, tileY} = body;
  const closest = tilemap.closest(tileX, tileY);

  // corner case inside bounds
  if (isCornerCase(closest)) {
    return null;
  }

  rayTop.cast(tilemap, tileX, tileY);
  rayRight.cast(tilemap, tileX, tileY);
  rayBottom.cast(tilemap, tileX, tileY);
  rayLeft.cast(tilemap, tileX, tileY);

  console.log({rayTop, rayRight, rayBottom, rayLeft});
  return null;

  // const y = sortPair(top, bottom);
  // const x = sortPair(left, right);

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
    const closestSolid = getShortestRay(x[0], x[1], y[0]);
    return closestSolid ? closestSolid.direction : null;
  }

  if (x.type === SOLID_BORDER && y.type === SOLID_SOLID) {
    const closestSolid = getShortestRay(x[0], y[0], y[1]);
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
