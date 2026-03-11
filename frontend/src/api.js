const BASE = 'https://travel-experience-platform-production.up.railway.app/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),

  // Listings
  getListings: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    return request(`/listings${qs ? '?' + qs : ''}`);
  },
  getListing: (id) => request(`/listings/${id}`),
  getMyListings: () => request('/listings/my/listings'),
  createListing: (body) => request('/listings', { method: 'POST', body: JSON.stringify(body) }),
  updateListing: (id, body) => request(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteListing: (id) => request(`/listings/${id}`, { method: 'DELETE' }),
};
