// @flow strict

export type EventType = GlobalEvent;

type GlobalEvent =
  | 'global/resize'
  | 'global/load'
  | 'global/beforeunload'
  | 'player/dead';
