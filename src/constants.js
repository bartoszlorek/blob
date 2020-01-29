export const baseSize = 32;

export const gridToLocal = n => n * baseSize;
export const localToGrid = n => Math.floor(n / baseSize);
