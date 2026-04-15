// Recipe API (Forkify)
export const API_URL = 'https://forkify-api.herokuapp.com/api';

// Backend API base URL
// In production (Vercel) this is the same origin, so an empty string works.
// In local dev, set VITE_API_URL=http://localhost:8001 in client/.env
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
