import {vectorRotation} from '@utils/physics';
import Component from '@core/physics/Component';
import Force from '@core/physics/Force';

import {calculateGravityDirection} from '../gravity/tileGravity';

class TileGravity extends Component {
  constructor(props) {
    super(props);

    props.body.gravity = new Force(0, 1, {
      str: 25,
      dex: 0.6,
    });
  }

  update() {
    const {body, tiles} = this.props;
    const direction = calculateGravityDirection(body, tiles);

    if (direction) {
      body.gravity.applyDirection(direction);
    }

    body.gravity.applyTo(body.velocity);
    body.sprite.rotation = vectorRotation(body.gravity.vector);
  }
}

export default TileGravity;
