import BoundingBox from '@models/BoundingBox';
import * as Vector from '@models/Vector';

import {applyTileCollision} from '../tileCollisions';

// temporary data
const _bbox = new BoundingBox();
const _vec2 = Vector.create();

function resolveBodyTileCollider(collider, deltaTime) {
  const {object1: body, object2: tilemap, callback} = collider;
  const {bbox, velocity} = body;

  _bbox.copy(bbox);

  Vector.copy(_vec2, velocity);
  Vector.multiplyX(_vec2, deltaTime);
  Vector.multiplyY(_vec2, deltaTime);

  applyTileCollision(tilemap, _bbox, _vec2);

  if (bbox.min[0] !== _bbox.min[0]) {
    bbox.min[0] = _bbox.min[0];
    bbox.max[0] = _bbox.max[0];
    velocity[0] = 0; // optional?
  }

  if (bbox.min[1] !== _bbox.min[1]) {
    bbox.min[1] = _bbox.min[1];
    bbox.max[1] = _bbox.max[1];
    velocity[1] = 0; // optional?
  }
}

export default resolveBodyTileCollider;
