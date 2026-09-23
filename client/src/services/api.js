import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fittrack_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fittrack_token');
      localStorage.removeItem('fittrack_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ─── Users ─────────────────────────────────────────────────────────────────
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getMembers: () => api.get('/users/members'),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// ─── Trainers ──────────────────────────────────────────────────────────────
export const trainerAPI = {
  getAll: () => api.get('/trainers'),
  getById: (id) => api.get(`/trainers/${id}`),
  getMyProfile: () => api.get('/trainers/me'),
  upsertProfile: (data) => api.put('/trainers/profile', data),
};

// ─── Plans ─────────────────────────────────────────────────────────────────
export const planAPI = {
  getActive: () => api.get('/plans'),
  getAll: () => api.get('/plans/all'),
  create: (data) => api.post('/plans', data),
  update: (id, data) => api.put(`/plans/${id}`, data),
  delete: (id) => api.delete(`/plans/${id}`),
};

// ─── Memberships ───────────────────────────────────────────────────────────
export const membershipAPI = {
  getMine: () => api.get('/memberships/me'),
  getAll: () => api.get('/memberships'),
  create: (data) => api.post('/memberships', data),
  update: (id, data) => api.put(`/memberships/${id}`, data),
};

// ─── Classes ───────────────────────────────────────────────────────────────
export const classAPI = {
  getAll: (params) => api.get('/classes', { params }),
  getById: (id) => api.get(`/classes/${id}`),
  getMine: () => api.get('/classes/mine'),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
};

// ─── Bookings ──────────────────────────────────────────────────────────────
export const bookingAPI = {
  getMine: () => api.get('/bookings/my'),
  getAll: () => api.get('/bookings'),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

// ─── Attendance ────────────────────────────────────────────────────────────
export const attendanceAPI = {
  getMine: () => api.get('/attendance/me'),
  getAll: (params) => api.get('/attendance', { params }),
  mark: (data) => api.post('/attendance', data),
};

// ─── Workouts ──────────────────────────────────────────────────────────────
export const workoutAPI = {
  getMine: () => api.get('/workouts/my'),
  getAssigned: () => api.get('/workouts/assigned'),
  getMemberPlan: (memberId) => api.get(`/workouts/member/${memberId}`),
  create: (data) => api.post('/workouts', data),
  update: (id, data) => api.put(`/workouts/${id}`, data),
};

// ─── Progress ──────────────────────────────────────────────────────────────
export const progressAPI = {
  getMine: () => api.get('/progress/me'),
  getMemberProgress: (userId) => api.get(`/progress/member/${userId}`),
  add: (data) => api.post('/progress', data),
  delete: (id) => api.delete(`/progress/${id}`),
};

// ─── Contact ───────────────────────────────────────────────────────────────
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id) => api.put(`/contact/${id}/read`),
};

// ─── Admin ─────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
};
