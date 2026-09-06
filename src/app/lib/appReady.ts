let appIsReady = false;
const listeners: Array<() => void> = [];

/** Call once the preloader has finished lifting away. */
export function markAppReady() {
  if (appIsReady) return;
  appIsReady = true;
  listeners.forEach((l) => l());
  listeners.length = 0;
}

/** Runs the callback immediately if the app is already ready, otherwise
 * queues it to run the moment markAppReady() is called. */
export function onAppReady(cb: () => void) {
  if (appIsReady) cb();
  else listeners.push(cb);
}
