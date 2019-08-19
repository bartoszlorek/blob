import {MockEntity} from '@utils/test';
import bodyTilesCollision from './bodyTilesCollision';

const deltaTime = 0.16;
const tiles = {closest: jest.fn()};
const callback = jest.fn();

describe('bodyTilesCollision()', () => {
  it('should call callback and not separate body and tile', () => {
    const body = new MockEntity(0, 0);
    const tile = new MockEntity(0, 24);

    tiles.closest.mockReturnValue([tile]);

    body.velocity.y = 5;
    body.intersection.mockReturnValue(true);

    bodyTilesCollision(body, tiles, callback, false, deltaTime);

    expect(body.position).toEqual({x: 0, y: 0.8});
  });

  it('should separate body and tile', () => {
    const body = new MockEntity(0, 0);
    const tile = new MockEntity(0, 24);

    tiles.closest.mockReturnValue([tile]);

    body.velocity.y = 5;
    body.intersection.mockReturnValue(true);

    bodyTilesCollision(body, tiles, callback, true, deltaTime);

    expect(body.position).toEqual({x: 0, y: 0});
  });
});
