import Sprite from '@models/Sprite';
import Group from '@models/Group';
import Body from '@physics/Body';

// import Explosive from '@traits/Explosive';

// const blinkFrames = [[50, entity => (entity.visible = !entity.visible)]];

function createMines(global, data) {
  const {texture} = global.assets['mines'];
  const mines = new Group();

  data.static.mines.forEach(([x, y]) => {
    const body = new Body(new Sprite(texture, x, y));

    // body.addTrait(new Explosive({global, scene, range: 1}));
    mines.add(body);
  });

  return mines;
}

export default createMines;
