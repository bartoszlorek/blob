import {vectorRotation} from '@utils/physics';
import {calculateGravityDirection} from '../gravity/tilesGravity';

function bodyTilesGravityResolver(constraint, deltaTime) {
  const {actorA: body, actorB: tilemap} = constraint;
  const direction = calculateGravityDirection(body, tilemap);

  if (direction) {
    body.gravity.applyDirection(direction);
  }

  body.gravity.applyTo(body.velocity);
  body.sprite.rotation = vectorRotation(body.gravity.vector);
}

export default bodyTilesGravityResolver;
