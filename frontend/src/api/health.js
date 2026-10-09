import { request, API_URL } from './client';

export async function getHealth() {
  try {
    const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return {
      status: 'offline',
      time: new Date().toISOString(),
      dbConnected: false,
      version: '0.1.0 (local demo)'
    };
  }
}
