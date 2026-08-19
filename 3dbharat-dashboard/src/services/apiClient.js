// Fake "network" layer. Every service function routes through here so that
// delay, error simulation, and response shape stay consistent everywhere —
// this is the thing we'd swap out for a real fetch() later.

const MIN_DELAY = 300;
const MAX_DELAY = 800;

// Roughly 1 in 25 calls simulates a transient failure so the UI's error
// states are exercised. Set to 0 to disable during manual testing.
const ERROR_RATE = 0.04;

function randomDelay() {
  return Math.round(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);
}

/**
 * Wraps a synchronous "resolver" function in a Promise that behaves like a
 * real API call: artificial latency + occasional simulated failure.
 */
export function simulateRequest(resolver, { errorRate = ERROR_RATE } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error("Network error: failed to reach server. Please retry."));
        return;
      }
      try {
        resolve(resolver());
      } catch (err) {
        reject(err);
      }
    }, randomDelay());
  });
}
