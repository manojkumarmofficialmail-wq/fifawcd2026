import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_BASE || '') + '/api';

const api = axios.create({ baseURL });

// Attach the admin key (if present) to every request; the server only
// enforces it on /admin routes, so this is harmless elsewhere.
api.interceptors.request.use((config) => {
  const key = localStorage.getItem('wcd_admin_key');
  if (key) config.headers['x-admin-key'] = key;
  return config;
});

// ---- Public ----
export const getTeams = () => api.get('/teams').then((r) => r.data);
export const getDashboard = () => api.get('/dashboard').then((r) => r.data);
export const getVisibility = () => api.get('/visibility').then((r) => r.data);
export const register = (payload) => api.post('/register', payload).then((r) => r.data);
export const pdfUrl = () => baseURL + '/pdf/daily-report';

// ---- Admin ----
export const adminLogin = (key) =>
  api.post('/admin/login', {}, { headers: { 'x-admin-key': key } }).then((r) => r.data);
export const getSettings = () => api.get('/admin/settings').then((r) => r.data);
export const setTime = (start_time, end_time) =>
  api.post('/admin/set-time', { start_time, end_time }).then((r) => r.data);
export const setVisibility = (show_register, show_live) =>
  api.post('/admin/visibility', { show_register, show_live }).then((r) => r.data);
export const eliminateTeam = (team, eliminated = true) =>
  api.post('/admin/eliminate-team', { team, eliminated }).then((r) => r.data);
export const getUsers = (params) => api.get('/admin/users', { params }).then((r) => r.data);

export default api;
