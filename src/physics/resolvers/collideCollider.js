import {baseSize} from '@app/consts';
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

  const minX = object1.minX / baseSize;
  const minY = object1.minY / baseSize;

  _bbox.minX = minX;
  _bbox.minY = minY;
  _bbox.maxX = minX + 1;
  _bbox.maxY = minY + 1;

  _velocity.x = object1.velocity.x * deltaTime;
  _velocity.y = object1.velocity.y * deltaTime;

  const {x, y} = resolveTileCollisionLegacy(_out, object2, _bbox, _velocity);

  if (x !== 0) {
    object1.minX += x * baseSize;
    object1.velocity.x = 0;
  }
  if (y !== 0) {
    object1.minY += y * baseSize;
    object1.velocity.y = 0;
  }
}

export default collideCollider;
