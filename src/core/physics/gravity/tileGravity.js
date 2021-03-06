// @flow strict

import Body from '@core/physics/Body';
import Tilemap from '@core/structure/Tilemap';
import Vector from '@core/physics/Vector';
import CompoundRay, {COMPOUND_TYPE as TYPE} from './CompoundRay';
import Ray from './Ray';

import {
  isOuterCornerCase,
  isInnerCornerCase,
  isOutsideOnCorner,
  getOutsideVector,
} from './tileGravityHelpers';

const rayLeft = new Ray(-1, 0);
const rayRight = new Ray(1, 0);
const rayTop = new Ray(0, -1);
const rayBottom = new Ray(0, 1);

const compX = new CompoundRay(rayLeft, rayRight);
const compY = new CompoundRay(rayTop, rayBottom);

const m_vector = Vector.create();

export function calculateGravityDirection(body: Body, tilemap: Tilemap) {
  if (tilemap.intersectsMargin(body, -1) === false) {
    // we should use last known gravity
    // for corners outside bounding box
    if (isOutsideOnCorner(body, tilemap)) {
      return null;
    }

    return getOutsideVector(body, tilemap, m_vector);
  }

  const tileX = body.tileX(tilemap.tilesize);
  const tileY = body.tileY(tilemap.tilesize);
  const closestTiles = tilemap.closest(tileX, tileY);

  /*
    █   ██     X
    █   ██████   █
    █            █
    ██████████   █
    outer corner case
  */

  if (isOuterCornerCase(closestTiles)) {
    return null;
  }

  /*
    █   ██X
    █   ██████   █
    █            █
    ██████████   █
    inner corner case
  */

  if (isInnerCornerCase(closestTiles)) {
    return null;
  }

  rayLeft.cast(tilemap, tileX, tileY);
  rayRight.cast(tilemap, tileX, tileY);
  rayTop.cast(tilemap, tileX, tileY);
  rayBottom.cast(tilemap, tileX, tileY);

  compX.sort();
  compY.sort();

  /*
    █   ██
    █   ██████   █
    █      X     █
    ██████████   █
    cave case
  */

  if (compX.type === TYPE.SOLID_SOLID && compY.type === TYPE.SOLID_SOLID) {
    m_vector[0] = 0;
    m_vector[1] = 1;
    return m_vector;
  }

  /*
    █   ██
    █ X ██████   █
    █            █
    ██████████   █
    chimney case
  */

  if (compX.type === TYPE.SOLID_SOLID && compY.type === TYPE.SOLID_BORDER) {
    if (compX.a.length === 1 && compX.b.length === 1) {
      m_vector[0] = 0;
      m_vector[1] = 1;
      return m_vector;
    }
  }

  /*
    █   ██   X
    █   ██████   █
    █            █
    ██████████   █
    common outside case
  */

  if (compX.type === TYPE.SOLID_BORDER && compY.type === TYPE.SOLID_BORDER) {
    const closestRay = Ray.min(compX.a, compY.a);
    return closestRay ? closestRay.vector : null;
  }

  /*
    ██████████   █
    .      X     █
    ██████████   █
    common inside cases
  */

  if (compX.type === TYPE.SOLID_SOLID && compY.type === TYPE.SOLID_BORDER) {
    const closestRay = Ray.min(Ray.min(compX.a, compX.b), compY.a);
    return closestRay ? closestRay.vector : null;
  }

  if (compX.type === TYPE.SOLID_BORDER && compY.type === TYPE.SOLID_SOLID) {
    const closestRay = Ray.min(Ray.min(compX.a, compY.a), compY.b);
    return closestRay ? closestRay.vector : null;
  }

  /*
    ██████████   █
    .          X █
    ██████████   █
    open gap cases
  */

  if (compX.type === TYPE.SOLID_BORDER && compY.type === TYPE.BORDER_BORDER) {
    return compX.a.vector;
  }

  if (compX.type === TYPE.BORDER_BORDER && compY.type === TYPE.SOLID_BORDER) {
    return compY.a.vector;
  }

  /*
    ██████████   █
    .      X  
    ██████████   █
    closed gap cases
  */

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
    m_vector[0] = 0;
    m_vector[1] = 1;
    return m_vector;
  }

  // default gravity
  m_vector[0] = 0;
  m_vector[1] = 1;
  return m_vector;
}
