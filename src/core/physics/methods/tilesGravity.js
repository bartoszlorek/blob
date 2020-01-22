import Vector from '../Vector';
import CompoundRay, {COMPOUND_TYPE as TYPE} from '../CompoundRay';
import Ray from '../Ray';

import {
  isCornerCase,
  isOutsideOnCorner,
  getOutsideVector,
} from './tilesGravityHelpers';

const rayLeft = new Ray(-1, 0);
const rayRight = new Ray(1, 0);
const rayTop = new Ray(0, -1);
const rayBottom = new Ray(0, 1);

const compX = new CompoundRay(rayLeft, rayRight);
const compY = new CompoundRay(rayTop, rayBottom);

const m_vector = Vector.create();

export function calculateGravityDirection(body, tilemap) {
  if (tilemap.intersectsMargin(body, -1) === false) {
    // we should use last known gravity
    // for corners outside bounding box
    if (isOutsideOnCorner(body, tilemap)) {
      return null;
    }

    return getOutsideVector(body, tilemap, m_vector);
  }

  const coordX = Math.round(body.min[0] / tilemap.tilesize);
  const coordY = Math.round(body.min[1] / tilemap.tilesize);
  const closestTiles = tilemap.closest(coordX, coordY);

  // corner case inside bounding box
  if (isCornerCase(closestTiles)) {
    return null;
  }

  rayLeft.cast(tilemap, coordX, coordY);
  rayRight.cast(tilemap, coordX, coordY);
  rayTop.cast(tilemap, coordX, coordY);
  rayBottom.cast(tilemap, coordX, coordY);

  compX.sort();
  compY.sort();

  // artificial gravity in the cave
  if (compX.type === TYPE.SOLID_SOLID && compY.type === TYPE.SOLID_SOLID) {
    m_vector[0] = 0;
    m_vector[1] = 1;
    return m_vector;
  }

  // common cases
  if (compX.type === TYPE.SOLID_BORDER && compY.type === TYPE.SOLID_BORDER) {
    if (compX.a.length < compY.a.length) {
      return compX.a.vector;
    }
    if (compX.a.length > compY.a.length) {
      return compY.a.vector;
    }
    return null;
  }

  if (compX.type === TYPE.SOLID_SOLID && compY.type === TYPE.SOLID_BORDER) {
    const closestRay = Ray.min(Ray.min(compX.a, compX.b), compY.a);
    return closestRay ? closestRay.vector : null;
  }

  if (compX.type === TYPE.SOLID_BORDER && compY.type === TYPE.SOLID_SOLID) {
    const closestRay = Ray.min(Ray.min(compX.a, compY.a), compY.b);
    return closestRay ? closestRay.vector : null;
  }

  // gap cases
  if (compX.type === TYPE.SOLID_BORDER && compY.type === TYPE.BORDER_BORDER) {
    return compX.a.vector;
  }

  if (compX.type === TYPE.BORDER_BORDER && compY.type === TYPE.SOLID_BORDER) {
    return compY.a.vector;
  }

  if (compX.type === TYPE.SOLID_SOLID && compY.type === TYPE.BORDER_BORDER) {
    if (compX.a.length < compX.b.length) {
      return compX.a.vector;
    }
    if (compX.a.length > compX.b.length) {
      return compX.b.vector;
    }
    m_vector[0] = -1;
    m_vector[1] = 0;
    return m_vector;
  }

  if (compX.type === TYPE.BORDER_BORDER && compY.type === TYPE.SOLID_SOLID) {
    if (compY.a.length < compY.b.length) {
      return compY.a.vector;
    }
    if (compY.a.length > compY.b.length) {
      return compY.b.vector;
    }
  }

  m_vector[0] = 0;
  m_vector[1] = 1;
  return m_vector;
}
