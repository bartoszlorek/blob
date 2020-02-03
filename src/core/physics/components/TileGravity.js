// @flow strict

import {vectorRotation} from '@utils/physics';
import Component from '@core/physics/Component';
import Force from '@core/physics/Force';

import {calculateGravityDirection} from '../gravity/tileGravity';

import type {EdgeType} from '@core/physics/constants';
import type {VectorType} from '@core/physics/Vector';
import type Body from '@core/physics/Body';
import type Tileset from '@core/structure/Tileset';

type PropsType = {
  body: Body,
  tiles: Tileset,
};

class TileGravity extends Component<PropsType> {
  constructor(props: PropsType) {
    super(props);

    props.body.gravity = new Force(0, 1, {
      str: 25,
      dex: 0.6,
    });
  }

  update() {
    const {body, tiles} = this.props;
    const {gravity} = body;

    if (gravity === null) {
      return;
    }
    const direction = calculateGravityDirection(body, tiles);

    if (direction) {
      gravity.applyDirection(direction);
    }

    gravity.applyTo(body.velocity);
    body.sprite.rotation = vectorRotation(gravity.vector);
  }
}

export default TileGravity;
