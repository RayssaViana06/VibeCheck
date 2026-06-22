const BASE_URL = 'https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-1800.onrender.com';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro na requisição');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const chatApi = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
