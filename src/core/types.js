// @flow strict

export type EventType = GlobalEvent | PlayerEvent;

type GlobalEvent = 'global/resize' | 'global/load' | 'global/beforeunload';
type PlayerEvent = 'player/dead' | 'player/score';
