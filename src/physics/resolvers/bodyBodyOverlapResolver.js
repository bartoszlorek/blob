import Vector from '@models/Vector';

// mutable data
const m_velocity = Vector.create();

function bodyBodyOverlapResolver(constraint, deltaTime) {
  const {actorA: bodyA, actorB: bodyB, effect} = constraint;
}

export default bodyBodyOverlapResolver;
