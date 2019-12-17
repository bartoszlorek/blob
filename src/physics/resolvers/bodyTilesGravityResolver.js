import {calculateGravity} from '@physics/gravity';

function bodyTilesGravityResolver(constraint, deltaTime) {
  const {actorA: body, actorB: tilemap} = constraint;
  const shiftVector = calculateGravity(body, tilemap);

  if (shiftVector) {
    body.gravity.update(shiftVector);
  }

  body.gravity.applyTo(body.velocity);
  // body.sprite.rotation = vectorRotation(body.gravity);
}

export default bodyTilesGravityResolver;
