export default {
  active: [
    {
      name: 'player',
      links: {
        ground: ['move', 'jump', 'physics'],
        mines: ['move', 'jump', 'physics']
      }
    },
    {
      name: 'enemies',
      links: {
        player: ['watcher'],
        ground: ['watcher']
      }
    }
  ],
  passive: [
    {
      name: 'ground'
    },
    {
      name: 'mines',
      links: {
        player: ['explosive']
      }
    },
    {
      name: 'prizes',
      links: {
        player: ['collectable']
      }
    }
  ]
};
