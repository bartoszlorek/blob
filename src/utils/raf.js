// @flow strict

export type RequestType = {current: boolean};

export function setFrameTimeout(
  callback: () => mixed,
  delay: number
): RequestType {
  const initial: number = performance.now();
  const request = {current: true};

  const handler = () => {
    if (request.current) {
      const current: number = performance.now();

      if (current - initial >= delay) {
        callback();
      } else {
        window.requestAnimationFrame(handler);
      }
    }
  };

  handler();
  return request;
}

export function setFrameInterval(
  callback: () => mixed,
  delay: number
): RequestType {
  let initial: number = performance.now();
  const request = {current: true};

  const handler = () => {
    if (request.current) {
      const current: number = performance.now();

      if (current - initial >= delay) {
        initial = current;
        callback();
      }
      window.requestAnimationFrame(handler);
    }
  };

  handler();
  return request;
}

export function clearFrameRequest(request: ?RequestType) {
  if (request) {
    request.current = false;
  }
}
