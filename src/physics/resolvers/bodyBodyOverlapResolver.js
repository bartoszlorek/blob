import Vector from '@models/Vector';
import {detectTileCollision} from '@physics/tilesCollisions';

// mutable data
const m_velocity = Vector.create();

function bodyBodyOverlapResolver(collider, deltaTime) {
  /*const {object1: body, object2: tilemap, callback} = collider;

  // delta time vector
  m_velocity[0] = body.velocity[0] * deltaTime;
  m_velocity[1] = body.velocity[1] * deltaTime;

  const shiftVector = detectTileCollision(tilemap, body, m_velocity, callback);

  if (shiftVector[0] !== 0) {
    body.translateX(shiftVector[0]);
    body.velocity[0] = 0;
  }

  if (shiftVector[1] !== 0) {
    body.translateY(shiftVector[1]);
    body.velocity[1] = 0;
  }*/
}

export default bodyBodyOverlapResolver;
