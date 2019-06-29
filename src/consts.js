export const baseSize = 24;

export const gridToLocal = n => n * baseSize;
export const localToGrid = n => Math.round(n / baseSize);
