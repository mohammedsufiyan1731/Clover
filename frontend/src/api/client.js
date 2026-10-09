// API Client for Apogee Mission Control
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'; // default true when developing without backend running

const wakingListeners = new Set();
let isWaking = false;

export function onWaking(callback) {
  wakingListeners.add(callback);
  return () => wakingListeners.delete(callback);
}

function setWakingState(state) {
  if (isWaking !== state) {
    isWaking = state;
    wakingListeners.forEach((cb) => cb(state));
  }
}

export async function request(path, options = {}) {
  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeoutMs = options.timeout || 60000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const slowWarningTimer = setTimeout(() => {
    setWakingState(true);
  }, 3000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(slowWarningTimer);
    setWakingState(false);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const msg = errorData.error?.message || errorData.detail || `Request failed (${res.status})`;
      throw new Error(msg);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(slowWarningTimer);
    setWakingState(false);
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
