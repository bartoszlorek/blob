import {lerp} from '@utils/math';
import Vector from '@models/Vector';

class Force extends Vector {
  constructor(x, y, {strength = 1, dexterity = 0.5} = {}) {
    super(x, y);
    this.strength = strength;
    this.dexterity = dexterity;
  }

  setForce(x, y) {
    this.x = lerp(this.x, x, this.dexterity);
    this.y = lerp(this.y, y, this.dexterity);
  }

  applyTo(vector) {
    vector.x += this.x * this.strength;
    vector.y += this.y * this.strength;
  }
}

export default Force;
