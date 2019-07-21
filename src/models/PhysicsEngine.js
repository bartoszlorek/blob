import {
  schema,
  calculateGravity,
  applyCollisions,
  hydrateSchema
} from '@models/physics';

export const EDGE = {
  TOP: Symbol('top'),
  RIGHT: Symbol('right'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left')
};

const shadowColor = 0xdaeaf2;
const maxShadowDistance = 5;

class PhysicsEngine {
  constructor() {
    this.gravitation = [];
    this.collisions = [];
  }

  addGravitation(layer) {
    this.gravitation.push(layer);
  }

  setCollisions(layers) {
    this.collisions = hydrateSchema(schema, layers);
  }

  update(deltaTime) {
    applyCollisions(this.collisions, deltaTime);
  }

  calculateGravity(gravity, entity) {
    if (this.gravitation.length === 0) {
      return;
    }
    const result = calculateGravity(entity, this.gravitation);

    if (result) {
      gravity.apply(result.x, result.y);
    }
  }

  dropShadow(entity) {
    // todo: multiple objects
    const {x, y} = entity.physics.gravity.direction;
    const match = this.gravitation[0].closestInDirection(
      entity.gridX,
      entity.gridY,
      x,
      y,
      maxShadowDistance
    );

    if (match && match.colorful) {
      match.colorful.setColor(shadowColor);
    }
  }
}

export default PhysicsEngine;
