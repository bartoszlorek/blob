// @flow strict

import Component from '@core/physics/Component';
import Vector from '@core/physics/Vector';
import {EDGE_BY_AXIS} from '@core/physics/constants';
import {detectTileCollision} from '@core/physics/collisions/tileCollisions';

import type {EdgeType} from '@core/physics/constants';
import type {VectorType} from '@core/physics/Vector';
import type Body from '@core/physics/Body';
import type Tileset from '@core/structure/Tileset';

type PropsType = {
  body: Body,
  tiles: Tileset,
  callback: (body: Body, tiles: Tileset, edge: EdgeType) => mixed,
};

class TileCollision extends Component<PropsType> {
  m_velocity: VectorType;
  handleCollision: (
    value: number,
    index: number,
    axis: number,
    shift: number,
    velocity: VectorType
  ) => boolean;

  constructor(props: PropsType) {
    super(props);

    // mutable data
    this.m_velocity = Vector.create();

    // handlers
    this.handleCollision = (value, index, axis, shift, velocity) => {
      const {body, tiles, callback} = this.props;
      const point = tiles.getPoint(index);

      const side = body.min[axis] < point[axis] * tiles.tilesize;
      const edge = EDGE_BY_AXIS[axis][+side];

      velocity[axis ? 1 : 0] = shift; // todo: use actual velocity
      callback(body, tiles, edge);
      return true;
    };
  }

  update(deltaTime: number) {
    const {body, tiles} = this.props;

    if (!tiles.intersects(body)) {
      return;
    }

    // delta time vector
    this.m_velocity[0] = body.velocity[0] * deltaTime;
    this.m_velocity[1] = body.velocity[1] * deltaTime;

    const shiftVector = detectTileCollision(
      tiles,
      body,
      this.m_velocity,
      this.handleCollision
    );

    if (shiftVector[0] !== 0) {
      body.translateX(shiftVector[0]);
      body.velocity[0] = 0;
    }

    if (shiftVector[1] !== 0) {
      body.translateY(shiftVector[1]);
      body.velocity[1] = 0;
    }
  }
}

export default TileCollision;
