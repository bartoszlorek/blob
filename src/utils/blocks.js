import {arrayForEach} from '@utils/array';

// entry = [x, y, length, assetIndex]
// length > 0  horizontal
// length < 0  vertical
// assetIndex  index of alternative name

export function resolveBlocks(name, entries, iteratee) {
  if (!entries) {
    return;
  }
  arrayForEach(entries, entry => {
    const [x, y, length = 1, assetIndex = 0] = entry;

    const asset = assetIndex ? `${name}_${pad(assetIndex)}` : name;
    const start = length > 0 ? x : y;
    const end = start + Math.abs(length);

    for (let pos = start; pos < end; pos++) {
      iteratee({
        x: length > 0 ? pos : x,
        y: length < 0 ? pos : y,
        asset
      });
    }
  });
}

function pad(n) {
  return n < 10 ? `0${n}` : n;
}
