
// Default to same-origin API to avoid CORS in production deployments
export const API_URL = import.meta.env.VITE_API_URL || "/api/v1";
