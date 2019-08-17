import {arrayForEach} from '@utils/array';

import Animator from '@models/Animator';
import Sprite from '@models/Sprite';
import Group from '@models/Group';
import Body from '@physics/Body';

import Explosive from '@traits/Explosive';

function createMines({data, global, scene}) {
  let {texture} = global.assets['mines'];
  let mines = new Group();

  if (data.static.mines) {
    arrayForEach(data.static.mines, ([x, y]) => {
      const sprite = new Sprite(texture, x, y);

      // animation
      sprite.animator = new Animator();
      sprite.animator.add('blink', [sprite]);

      // group and traits
      const mine = new Body(sprite);
      mine.addTrait(new Explosive({global, scene}));
      mines.add(mine);
    });

    scene.animations.add(mines);
    scene.animations.keyframes['blink'] = [
      [50, sprite => (sprite.visible = !sprite.visible)]
    ];
  } else {
    mines = null;
  }

  function cleanup() {
    texture = null;
    mines = null;
  }

  return [mines, cleanup];
}

export default createMines;
