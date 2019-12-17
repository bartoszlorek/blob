import Vector from '@models/Vector';
import {detectTilesCollision} from '@physics/tilesCollisions';

// mutable data
const m_velocity = Vector.create();

const bodyTilesCollisionResolver = constraint => deltaTime => {
  const {actorA: body, actorB: tilemap, effect} = constraint;

  // delta time vector
  m_velocity[0] = body.velocity[0] * deltaTime;
  m_velocity[1] = body.velocity[1] * deltaTime;

  const shiftVector = detectTilesCollision(tilemap, body, m_velocity, effect);

  if (shiftVector[0] !== 0) {
    body.translateX(shiftVector[0]);
    body.velocity[0] = 0;
  }

  if (shiftVector[1] !== 0) {
    body.translateY(shiftVector[1]);
    body.velocity[1] = 0;
  }
};

export default bodyTilesCollisionResolver;