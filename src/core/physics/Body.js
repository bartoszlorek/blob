// @flow strict

import BoundingBox from '@core/BoundingBox';
import Vector from '@core/physics/Vector';
import {rotateEdge} from '@utils/physics';
import {EDGE} from '@core/physics/constants';

import type PIXI from 'pixi.js';
import type Trait from '@core/Trait';
import type World from '@core/physics/World';
import type Force from '@core/physics/Force';
import type {VectorType} from '@core/physics/Vector';

const getSpriteOffsetTable = (bboxSize: number, spriteSize: number) => {
  const middle = bboxSize / 2;
  const offset = (bboxSize - spriteSize) / 2;

  return [
    [middle, middle - offset], // top
    [middle - offset, middle], // right
    [middle, middle + offset], // bottom
    [middle + offset, middle], // left
  ];
};

class Body extends BoundingBox {
  +isBody: true;
  +isGroup: false;
  +isTiles: false;

  +offsetTable: Array<VectorType>; // todo: use as argument
  +size: number;

  sprite: PIXI.Sprite;
  velocity: VectorType;
  gravity: Force | null;

  traits: Array<Trait>;
  trait: {[name: string]: any}; // todo: subtypes of Trait
  parent: World | null;
  alive: boolean;

  constructor(sprite: PIXI.Sprite, position: VectorType, size: number = 32) {
    super(position, [position[0] + size, position[1] + size]);

    // pixijs
    this.sprite = sprite;
    this.sprite.anchor.set(0.5);
    this.offsetTable = getSpriteOffsetTable(size, sprite.width);

    // other
    this.size = size;
    this.velocity = Vector.create(0, 0);
    this.gravity = null;

    this.traits = [];
    this.trait = {};
    this.parent = null;
    this.alive = true;

    this.isBody = true;
    this.isGroup = false;
    this.isTiles = false;

    this.updateSprite();
  }

  update(deltaTime: number) {
    // update sprite to the position from the previous frame
    this.updateSprite();

    // traits phase
    for (let index = 0; index < this.traits.length; index++) {
      this.traits[index].update(this, deltaTime);
    }

    // apply velocity from the current frame to the bbox
    this.translateX(this.velocity[0] * deltaTime);
    this.translateY(this.velocity[1] * deltaTime);
  }

  updateSprite() {
    let offset = this.offsetTable[EDGE.BOTTOM];

    if (this.gravity) {
      // todo: rotate edge in TileGravity
      offset = this.offsetTable[Vector.edge(this.gravity.vector)];
      // offset = this.offsetTable[rotateEdge(this.gravity.vector, EDGE.BOTTOM)];
    }

    this.sprite.position.x = this.min[0] + offset[0];
    this.sprite.position.y = this.min[1] + offset[1];
  }

  addTrait(trait: Trait) {
    this.traits.push(trait);
    this.trait[trait.name] = trait;
  }

  destroy() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  unsafeDestroy() {
    this.sprite.destroy();
    this.sprite = null;
    this.parent = null;
  }
}

export default Body;
