import {colliderType} from '@physics/Collider';
import gravityCollider from './gravityCollider';

export function resolveCollider(collider, deltaTime) {
  if (!collider.isActive) {
    return;
  }
  const {object1, object2, type} = collider;

  switch (type) {
    case colliderType.gravity:
      if (object1.isBody && object2.isTileset) {
        gravityCollider(collider, deltaTime);
      }
      break;
  }
}
