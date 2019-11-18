import {calculateGravity} from '../internal/gravity';

function gravityResolver(collider, deltaTime) {
  const {object1, object2, callback} = collider;
  const result = calculateGravity(object1, object2);

  if (result) {
    object1.gravity.apply(result.x, result.y);
  }
  callback(object1, object2, deltaTime);
}

export default gravityResolver;
