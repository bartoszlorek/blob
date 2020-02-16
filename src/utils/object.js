// @flow strict

export function objectForEach<V, T: {}>(
  object: T,
  iteratee: (value: V, key: string, object: T) => mixed
) {
  const props = Object.keys(object);

  for (let index = 0; index < props.length; index++) {
    const key = props[index];

    if (iteratee(object[key], key, object) === false) {
      return;
    }
  }
}
