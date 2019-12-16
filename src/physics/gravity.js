import Vector from '@models/Vector';
import Ray from '@physics/core/Ray';
import CompoundRay, {COMPOUND_TYPE as TYPE} from '@physics/core/CompoundRay';
import {outsideVector, isCornerCase} from '@physics/helpers';

const rayLeft = new Ray(-1, 0);
const rayRight = new Ray(1, 0);
const rayTop = new Ray(0, -1);
const rayBottom = new Ray(0, 1);

const x = new CompoundRay(rayLeft, rayRight);
const y = new CompoundRay(rayTop, rayBottom);

const m_vector = Vector.create();

export function calculateGravity(body, tilemap) {
  m_vector[0] = 0;
  m_vector[1] = 1;

  return m_vector;

  /*
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

  rayLeft.cast(tilemap, tileX, tileY);
  rayRight.cast(tilemap, tileX, tileY);
  rayTop.cast(tilemap, tileX, tileY);
  rayBottom.cast(tilemap, tileX, tileY);

  x.sort();
  y.sort();

  // artificial gravity in the cave
  if (x.type === TYPE.SOLID_SOLID && y.type === TYPE.SOLID_SOLID) {
    return new Vector(0, 1);
  }

  // common cases
  if (x.type === TYPE.SOLID_BORDER && y.type === TYPE.SOLID_BORDER) {
    if (x.a.length < y.a.length) {
      return x.a.vector;
    }
    if (x.a.length > y.a.length) {
      return y.a.vector;
    }
    return null;
  }

  if (x.type === TYPE.SOLID_SOLID && y.type === TYPE.SOLID_BORDER) {
    const closest = Ray.min(Ray.min(x.a, x.b), y.a);
    return closest ? closest.vector : null;
  }

  if (x.type === TYPE.SOLID_BORDER && y.type === TYPE.SOLID_SOLID) {
    const closest = Ray.min(Ray.min(x.a, y.a), y.b);
    return closest ? closest.vector : null;
  }

  // gap cases
  if (x.type === TYPE.SOLID_BORDER && y.type === TYPE.BORDER_BORDER) {
    return x.a.vector;
  }

  if (x.type === TYPE.BORDER_BORDER && y.type === TYPE.SOLID_BORDER) {
    return y.a.vector;
  }

  if (x.type === TYPE.SOLID_SOLID && y.type === TYPE.BORDER_BORDER) {
    if (x.a.length < x.b.length) {
      return x.a.vector;
    }
    if (x.a.length > x.b.length) {
      return x.b.vector;
    }
    return new Vector(-1, 0);
  }

  if (x.type === TYPE.BORDER_BORDER && y.type === TYPE.SOLID_SOLID) {
    if (y.a.length < y.b.length) {
      return y.a.vector;
    }
    if (y.a.length > y.b.length) {
      return y.b.vector;
    }
    return new Vector(0, 1);
  }*/
}
