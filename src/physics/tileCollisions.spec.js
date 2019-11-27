import Tilemap from '@models/Tilemap';
import {resolveTileCollision} from './tileCollisions';

// prettier-ignore
const velocity = {
  up:        {x: 0,     y: -0.25},
  upLeft:    {x: -0.25, y: -0.25},
  upRight:   {x: 0.25,  y: -0.25},
  down:      {x: 0,     y: 0.25},
  downLeft:  {x: -0.25, y: 0.25},
  downRight: {x: 0.25,  y: 0.25},
  left:      {x: -0.25, y: 0},
  right:     {x: 0.25,  y: 0},
};

describe('resolveTileCollision()', () => {
  // prettier-ignore
  const values = [
    1, 1, 0, 0, 0,
    1, 1, 0, 0, 1,
    1, 1, 1, 1, 1,
  ];

  // -2    -1     0     1     2     3
  //  +-----+-----+-----+-----+-----+ -1
  //  |  1  |  1  |  0  |  0  |  0  |
  //  +-----+-----+-----+-----+-----+ 0
  //  |  1  |  1  |  0. |  0  |  1  |
  //  +-----+-----+-----+-----+-----+ 1
  //  |  1  |  1  |  1  |  1  |  1  |
  //  +-----+-----+-----+-----+-----+ 2
  //  |  0  |  0  |  0  |  0  |  0  |
  //  +-----+-----+-----+-----+-----+ 3

  test.each`
    name                  | position           | result
    ${'up'}               | ${{x: -1, y: 2}}   | ${{x: 0, y: 0.25}}
    ${'up-out'}           | ${{x: 0, y: 0}}    | ${{x: 0, y: 0}}
    ${'upLeft'}           | ${{x: -0.5, y: 2}} | ${{x: 0, y: 0.25}}
    ${'upLeft-corner'}    | ${{x: 3, y: 2}}    | ${{x: 0, y: 0.25}}
    ${'upRight'}          | ${{x: 0.5, y: 2}}  | ${{x: 0, y: 0.25}}
    ${'upRight-corner'}   | ${{x: -3, y: 2}}   | ${{x: 0, y: 0.25}}
    ${'down'}             | ${{x: 0, y: 0}}    | ${{x: 0, y: -0.25}}
    ${'down-out'}         | ${{x: 1, y: -1}}   | ${{x: 0, y: 0}}
    ${'down-corner'}      | ${{x: 2, y: -1}}   | ${{x: 0, y: -0.25}}
    ${'downLeft'}         | ${{x: 0, y: 0}}    | ${{x: 0.25, y: -0.25}}
    ${'downLeft-corner'}  | ${{x: 0, y: -2}}   | ${{x: 0, y: -0.25}}
    ${'downRight'}        | ${{x: 0, y: 0}}    | ${{x: 0, y: -0.25}}
    ${'downRight-corner'} | ${{x: 1, y: -1}}   | ${{x: 0, y: -0.25}}
    ${'left'}             | ${{x: 0, y: -1}}   | ${{x: 0.25, y: 0}}
    ${'left-out'}         | ${{x: 1, y: 0}}    | ${{x: 0, y: 0}}
    ${'right'}            | ${{x: 1, y: 0}}    | ${{x: -0.25, y: 0}}
    ${'right-out'}        | ${{x: 2, y: -1}}   | ${{x: 0, y: 0}}
  `(
    'should return penetration for velocity going $name',
    ({name, position, result}) => {
      const map = new Tilemap(values, 5, [-2, -1]);
      const dir = name.split('-')[0];
      const vel = velocity[dir];

      // apply delta velocity
      const x = position.x + vel.x;
      const y = position.y + vel.y;

      const bbox = {
        minX: x,
        maxX: x + 1,
        minY: y,
        maxY: y + 1,
      };

      const out = {};
      resolveTileCollision(out, map, bbox, vel);
      expect(out).toEqual(result);
    }
  );
});
