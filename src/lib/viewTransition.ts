export const navigateWithWind = (callback: () => void) => {
  if (typeof document.startViewTransition === 'function') {
    document.startViewTransition(callback);
    return;
  }

  callback();
};
