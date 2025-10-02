import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1';

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pending = [];

function onRefreshed(token) {
  pending.forEach((cb) => cb(token));
  pending = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw error;
      if (isRefreshing) {
        return new Promise((resolve) => {
          pending.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }
      isRefreshing = true;
      try {
        const resp = await axios.post(`${API_BASE}/auth/refresh-token`, { refreshToken });
        const newToken = resp.data.tokens.accessToken;
        const newRefresh = resp.data.tokens.refreshToken;
        if (newToken) localStorage.setItem('accessToken', newToken);
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
        onRefreshed(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } finally {
        isRefreshing = false;
      }
    }
    throw error;
  }
);


