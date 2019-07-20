import {hydrateSchema} from './hydration';
import schema from './schema.json';

describe('hydrateSchema()', () => {
  const player = {name: 'player'};
  const ground = {name: 'ground'};
  const mines = {name: 'mines'};
  const enemies = {name: 'enemies'};

  it('hydrates player-ground collision schema', () => {
    const result = hydrateSchema(schema, {player, ground});

    expect(result).toEqual({
      active: [
        {
          name: 'player',
          layer: player,
          links: {
            ground: expect.any(Function)
          }
        }
      ],
      passive: [
        {
          name: 'ground',
          layer: ground,
          links: {}
        }
      ]
    });
  });

  it('hydrates player-mines collision schema', () => {
    const result = hydrateSchema(schema, {player, mines});

    expect(result).toEqual({
      active: [
        {
          name: 'player',
          layer: player,
          links: {
            mines: expect.any(Function)
          }
        }
      ],
      passive: [
        {
          name: 'mines',
          layer: mines,
          links: {
            player: expect.any(Function)
          }
        }
      ]
    });
  });

  it('hydrates player-enemies collision schema', () => {
    const result = hydrateSchema(schema, {player, enemies});

    expect(result).toEqual({
      active: [
        {
          name: 'player',
          layer: player,
          links: {}
        },
        {
          name: 'enemies',
          layer: enemies,
          links: {
            player: expect.any(Function)
          }
        }
      ],
      passive: []
    });
  });

  it('hydrates enemies-ground collision schema', () => {
    const result = hydrateSchema(schema, {enemies, ground});

    expect(result).toEqual({
      active: [
        {
          name: 'enemies',
          layer: enemies,
          links: {
            ground: expect.any(Function)
          }
        }
      ],
      passive: [
        {
          name: 'ground',
          layer: ground,
          links: {}
        }
      ]
    });
  });
});
