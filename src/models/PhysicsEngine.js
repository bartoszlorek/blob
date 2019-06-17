import Vector from '@utils/Vector';

class PhysicsEngine {
  constructor(rigidBodies = []) {
    this.rigidBodies = rigidBodies;
    this.gravityForce = 25;
    this.gravityDirection = new Vector(0, 1);
    this.gravity = new Vector(0, 0);
  }

  addRigidBody(layer) {
    this.rigidBodies.push(layer);
  }

  applyGravity(entity) {
    entity.vel.x += this.gravityDirection.x * this.gravityForce;
    entity.vel.y += this.gravityDirection.y * this.gravityForce;
  }
}

export default PhysicsEngine;
