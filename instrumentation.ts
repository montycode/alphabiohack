// Ensure this runs as early as possible in the Next.js runtime
// Next.js will execute this file automatically when present at project root

import { EventEmitter } from "events";

// Increase default max listeners to avoid noisy MaxListenersExceededWarning
EventEmitter.defaultMaxListeners = Math.max(
  EventEmitter.defaultMaxListeners || 10,
  50
);

export async function register() {
  // no-op: the side effect above is what we need
}
