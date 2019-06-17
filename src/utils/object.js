export function objectForEach(object, iteratee) {
  const props = Object.keys(object);

  for (let index = 0; index < props.length; index++) {
    const key = props[index];

    if (iteratee(object[key], key, object) === false) {
      return;
    }
  }
}
