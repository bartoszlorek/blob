import {calculateGravity} from '@physics/gravity';

function bodyTilesGravityResolver(constraint, deltaTime) {
  const {actorA: body, actorB: tilemap} = constraint;
  const direction = calculateGravity(body, tilemap);

  if (direction) {
    body.gravity.applyDirection(direction);
  }

  body.gravity.applyTo(body.velocity);
  // body.sprite.rotation = vectorRotation(body.gravity);
}

export default bodyTilesGravityResolver;
