import Tilemap from '@core/structure/Tilemap';
import BoundingBox from '@core/BoundingBox';
import {
  resolveTileCollision,
  resolveTileCollisionLegacy,
} from './tilesCollisions';

// prettier-ignore
const velocity = {
  up:         [0,     -0.25],
  upLeft:     [-0.25, -0.25],
  upLeftFast: [-0.25, -2],
  upRight:    [0.25,  -0.25],
  down:       [0,     0.25],
  downLeft:   [-0.25, 0.25],
  downRight:  [0.25,  0.25],
  left:       [-0.25, 0],
  right:      [0.25,  0],
};

describe('basic', () => {
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
    ${'downRight-wall'}   | ${{x: 1, y: 0}}    | ${{x: -0.25, y: -0.25}}
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
      const x = position.x + vel[0];
      const y = position.y + vel[1];

      const out = {};
      resolveTileCollisionLegacy(out, map, bbox, vel);
      expect(out).toEqual(result);
    }
  );
});

fdescribe('platform', () => {
  // prettier-ignore
  const values = [
    0, 0, 0, 0, 1, 0,
    1, 0, 1, 0, 1, 1,
    1, 1, 1, 0, 1, 1,
  ];

  // -8    -4    -2     0     2     4     8
  //  +-----+-----+-----+-----+-----+-----+ -2
  //  |  0  |  0  |  0  |  0  |  1  |  0  |
  //  +-----+-----+-----+-----+-----+-----+ 0
  //  |  1  |  0  |  1  |  0. |  1  |  1  |
  //  +-----+-----+-----+-----+-----+-----+ 2
  //  |  1  |  1  |  1  |  0  |  1  |  1  |
  //  +-----+-----+-----+-----+-----+-----+ 4
  //  |  0  |  0  |  0  |  0  |  0  |  0  |
  //  +-----+-----+-----+-----+-----+-----+ 8

  test.each`
    name    | initial    | penetration
    ${'up'} | ${[-2, 4]} | ${[0, 0.25]}
  `(
    'should return penetration for velocity going $name',
    ({name, initial, penetration}) => {
      const dir = name.split('-')[0];
      const [x, y] = initial;

      const map = new Tilemap(values, 2, 6, [-8, -2]);
      const box = new BoundingBox([x, y], [2, 2]);
      const vec2 = velocity[dir];

      // apply velocity vector
      box.translate(vec2);

      const result = resolveTileCollision(map, box, vec2);
      expect(result).toEqual(penetration);
    }
  );

  // ${'up-out'}           | ${[0, 0]}  | ${[0, 0]}
  //   ${'upLeft'}           | ${[-1, 4]} | ${[0, 0.25]}
  //   ${'upLeft-corner'}    | ${[8, 4]}  | ${[0, 0.25]}
  //   ${'upRight'}          | ${[1, 4]}  | ${[0, 0.25]}
  //   ${'upRight-corner'}   | ${[-8, 4]} | ${[0, 0.25]}
  //   ${'down'}             | ${[0, 0]}  | ${[0, -0.25]}
  //   ${'down-out'}         | ${[2, -2]} | ${[0, 0]}
  //   ${'down-corner'}      | ${[4, -2]} | ${[0, -0.25]}
  //   ${'downLeft'}         | ${[0, 0]}  | ${[0.25, -0.25]}
  //   ${'downLeft-corner'}  | ${[0, -4]} | ${[0, -0.25]}
  //   ${'downRight'}        | ${[0, 0]}  | ${[0, -0.25]}
  //   ${'downRight-wall'}   | ${[2, 0]}  | ${[-0.25, -0.25]}
  //   ${'downRight-corner'} | ${[2, -2]} | ${[0, -0.25]}
  //   ${'left'}             | ${[0, -2]} | ${[0.25, 0]}
  //   ${'left-out'}         | ${[2, 0]}  | ${[0, 0]}
  //   ${'right'}            | ${[2, 0]}  | ${[-0.25, 0]}
  //   ${'right-out'}        | ${[4, -1]} | ${[0, 0]}
});
