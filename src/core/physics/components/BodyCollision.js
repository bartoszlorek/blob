// @flow strict

import Component from '@core/physics/Component';

import type {EdgeType} from '@core/physics/constants';
import type Body from '@core/physics/Body';
import type Group from '@core/structure/Group';

type PropsType = {
  bodyA: Body,
  bodyB: Body | Group,
  callback: (body: Body, body: Body, edge: EdgeType) => mixed,
};

class BodyCollision extends Component<PropsType> {
  constructor(props: PropsType) {
    super(props);
  }

  update(deltaTime: number) {}
}

export default BodyCollision;
