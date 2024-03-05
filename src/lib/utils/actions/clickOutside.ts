export const clickOutside = (node: HTMLElement, callbackFn: () => void) => {
  function onClick(event: Event) {
    if (!node.contains(event.target as Node)) {
      callbackFn();
    }
  }

  document.body.addEventListener('click', onClick);

  return {
    destroy() {
      document.body.removeEventListener('click', onClick);
    },
  };
};
