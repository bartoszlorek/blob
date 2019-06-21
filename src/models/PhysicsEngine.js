import {arrayForEach} from '@utils/array';
import {mergeBounds} from '@utils/bounds';
import {modIndex} from '@utils/math';
import Vector from '@models/Vector';
import Raycast from '@models/Raycast';
import Force from '@models/Force';

export const EDGE = {
  TOP: Symbol('top'),
  RIGHT: Symbol('right'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left')
};

class PhysicsEngine {
  constructor() {
    this.gravity = new Force(0, 1, {strength: 25});
    this.solids = [];
    this.bounds = null;
  }

  addSolids(layer) {
    this.solids.push(layer);
    this.updateBounds();
  }

  updateBounds() {
    this.bounds = mergeBounds(
      ...this.solids.map(layer => layer.entities.bounds())
    );
  }

  applyGravity(entity) {
    this.gravity.applyTo(entity.vel);
  }

  rotateVector(vector) {
    const {direction} = this.gravity;
    const {x, y} = vector;

    if (direction.y < 0) {
      vector.x = -x;
      vector.y = -y;
    } else if (direction.x > 0) {
      vector.x = y;
      vector.y = -x;
    } else if (direction.x < 0) {
      vector.x = -y;
      vector.y = x;
    }
    return vector;
  }

  rotateEdge(edge) {
    const table = Object.values(EDGE);
    const index = table.indexOf(edge);
    const {direction} = this.gravity;

    let shift = 0;
    if (direction.x < 0) {
      shift = 1;
    } else if (direction.y < 0) {
      shift = 2;
    } else if (direction.x > 0) {
      shift = 3;
    }
    const rotatedIndex = modIndex(index - shift, 4);
    return table[rotatedIndex];
  }

  calculateGravityDirection(entity) {
    if (this.solids.length === 0) {
      return;
    }

    // outside bounds
    if (entity.bottom <= this.bounds.top) {
      this.gravity.setForce(0, 1);
    } else if (entity.top >= this.bounds.bottom) {
      this.gravity.setForce(0, -1);
    } else if (entity.right <= this.bounds.left) {
      this.gravity.setForce(1, 0);
    } else if (entity.left >= this.bounds.right) {
      this.gravity.setForce(-1, 0);

      // corner case
    } else if (this.isCornerCase(entity)) {
      console.log('corner');

      // raycasting
    } else {
      const raycast = new Raycast(entity.ownerGlobal, this.solids, this.bounds);

      const bottom = {
        value: raycast.scan(entity.pos, new Vector(0, 1)),
        force: new Vector(0, 1),
        label: 'bottom'
      };
      const top = {
        value: raycast.scan(entity.pos, new Vector(0, -1)),
        force: new Vector(0, -1),
        label: 'top'
      };
      const right = {
        value: raycast.scan(entity.pos, new Vector(1, 0)),
        force: new Vector(1, 0),
        label: 'right'
      };
      const left = {
        value: raycast.scan(entity.pos, new Vector(-1, 0)),
        force: new Vector(-1, 0),
        label: 'left'
      };

      const y = sortPair(top, bottom);
      const x = sortPair(left, right);

      // common cases
      if (y.type === 'solid-solid' && x.type === 'solid-solid') {
        console.log('solid-solid solid-solid');
      } else if (y.type === 'solid-border' && x.type === 'solid-border') {
        if (y[0].value.distance < x[0].value.distance) {
          this.gravity.setForce(y[0].force.x, y[0].force.y);
        } else if (x[0].value.distance < y[0].value.distance) {
          this.gravity.setForce(x[0].force.x, x[0].force.y);
        } else if (y[1].value.distance < x[1].value.distance) {
          this.gravity.setForce(y[0].force.x, y[0].force.y);
        } else if (x[1].value.distance < y[1].value.distance) {
          this.gravity.setForce(x[0].force.x, x[0].force.y);
        } else {
          this.gravity.setForce(y[0].force.x, y[0].force.y);
        }
      } else if (
        (y.type === 'solid-solid' && x.type === 'solid-border') ||
        (y.type === 'solid-border' && x.type === 'solid-solid')
      ) {
        console.log('solid-solid solid-border');
      }
    }
  }

  applyCollisionX(entity) {
    arrayForEach(this.solids, layer => {
      layer.entities.forEach(other => {
        if (!entity.intersection(other)) {
          return;
        }
        if (entity.vel.x > 0) {
          if (entity.right > other.left) {
            entity.obstruct(EDGE.RIGHT, other);
          }
        } else if (entity.vel.x < 0) {
          if (entity.left < other.right) {
            entity.obstruct(EDGE.LEFT, other);
          }
        }
      });
    });
  }

  applyCollisionY(entity) {
    arrayForEach(this.solids, layer => {
      layer.entities.forEach(other => {
        if (!entity.intersection(other)) {
          return;
        }
        if (entity.vel.y > 0) {
          if (entity.bottom > other.top) {
            entity.obstruct(EDGE.BOTTOM, other);
          }
        } else if (entity.vel.y < 0) {
          if (entity.top < other.bottom) {
            entity.obstruct(EDGE.TOP, other);
          }
        }
      });
    });
  }

  isCornerCase(entity) {
    return false;
  }
}

function sortPair(a, b) {
  const pair = [];

  if (a.value.type === 'solid') {
    pair.push(a, b);
  } else {
    pair.push(b, a);
  }

  pair.type = `${pair[0].value.type}-${pair[1].value.type}`;
  return pair;
}

export default PhysicsEngine;
