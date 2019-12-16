export const EDGE = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3,
};

export const EDGE_BY_AXIS = [
  [EDGE.LEFT, EDGE.RIGHT],
  [EDGE.TOP, EDGE.BOTTOM],
];

// prettier-ignore
export const EDGE_CYCLE = [
  EDGE.TOP,
  EDGE.RIGHT,
  EDGE.BOTTOM,
  EDGE.LEFT
];
