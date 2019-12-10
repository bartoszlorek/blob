import {baseSize} from '@app/consts';
import BoundingBox from '@models/BoundingBox';
import {
  resolveTileCollision,
  resolveTileCollisionLegacy,
} from '../tileCollisions';

const _bbox = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
};

const _out = {
  x: 0,
  y: 0,
};

const _velocity = {
  x: 0,
  y: 0,
};

function collideCollider(collider, deltaTime) {
  const {object1, object2, callback} = collider;

  // extract before own implementation
  const {velocity, minX, minY} = object1;

  const bbox = new BoundingBox([minX, minY], [baseSize, baseSize]);
  const vec2 = [velocity.x * deltaTime, velocity.y * deltaTime];

  const newBBox = resolveTileCollisionLegacy(object2, bbox, vec2);

  if (object1.minX !== newBBox.min[0]) {
    object1.minX = newBBox.min[0];
    object1.velocity.x = 0;
  }

  if (object1.minY !== newBBox.min[1]) {
    object1.minY = newBBox.min[1];
    object1.velocity.y = 0;
  }
}

export default collideCollider;
