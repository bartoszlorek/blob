import {EDGE} from '@physics/consts';

function bodyBodyOverlapResolver(constraint, deltaTime) {
  const {actorA: bodyA, actorB: bodyB, effect} = constraint;

  if (bodyB.isGroup) {
    bodyB.forEach(child => {
      if (bodyA.intersects(child)) {
        effect(bodyA, child, getOverlapingEdge(bodyA, child));
      }
    });
  } else {
    if (bodyA.intersects(bodyB)) {
      effect(bodyA, bodyB, getOverlapingEdge(bodyA, bodyB));
    }
  }
}

function getOverlapingEdge(bodyA, bodyB) {
  const diffX = bodyA.min[0] - bodyB.min[0];
  const diffY = bodyA.min[1] - bodyB.min[1];

  if (diffX === diffY) {
    return 0;
  }
  if (Math.abs(diffX) > Math.abs(diffY)) {
    return diffX < 0 ? EDGE.RIGHT : EDGE.LEFT;
  } else {
    return diffY < 0 ? EDGE.BOTTOM : EDGE.TOP;
  }
}

export default bodyBodyOverlapResolver;
