const API_BASE = import.meta.env.VITE_API_URL;

const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE}${endpoint}`);
    return res.json();
  },

  post: async (endpoint, data) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export default api;
