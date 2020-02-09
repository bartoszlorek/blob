// @flow strict

const fadeDuration = 400;

export const fadeIn = (element: HTMLElement, callback?: () => mixed) => {
  element.classList.add('fade-in');

  setTimeout(() => {
    if (callback) callback();
    element.classList.remove('fade-in');
  }, fadeDuration);
};

export const fadeOut = (element: HTMLElement, callback?: () => mixed) => {
  element.classList.add('fade-out');

  setTimeout(() => {
    if (callback) callback();
    element.classList.remove('fade-out');
  }, fadeDuration);
};
