import {createDefinition} from './definition';

describe('createDefinition()', () => {
  const player = {name: 'player'};
  const ground = {name: 'ground'};
  const mines = {name: 'mines'};
  const enemies = {name: 'enemies'};

  it('handles player-ground collision', () => {
    const result = createDefinition({player, ground});

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

  it('handles player-mines collision', () => {
    const result = createDefinition({player, mines});

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

  it('handles player-enemies collision', () => {
    const result = createDefinition({player, enemies});

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

  it('handles enemies-ground collision', () => {
    const result = createDefinition({enemies, ground});

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
