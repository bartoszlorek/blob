// @flow strict

const fadeDuration = 400;

export function fadeInElement(element: HTMLElement, callback?: () => mixed) {
  element.classList.add('fade-in');

  setTimeout(() => {
    if (callback) callback();
    element.classList.remove('fade-in');
  }, fadeDuration);
}

export function fadeOutElement(element: HTMLElement, callback?: () => mixed) {
  element.classList.add('fade-out');

  setTimeout(() => {
    if (callback) callback();
    element.classList.remove('fade-out');
  }, fadeDuration);
}

export function showElement(element: HTMLElement) {
  element.classList.remove('hidden');
}

export function hideElement(element: HTMLElement) {
  element.classList.add('hidden');
}
