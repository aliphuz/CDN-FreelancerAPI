import axios from 'axios';
import { configs } from 'eslint-plugin-react-refresh';

const API_BASE_URL = 'https://localhost:60300/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use((configs) => {
  const token = localStorage.getItem('token');
  if (token) {
    configs.headers.Authorization = `Bearer ${token}`;
  }
  return configs;
});

export const authApi = {
  register: (data) => 
    api.post('/Auth/register', data),
  login: (data) => 
    api.post('/Auth/login', data),
};

export const freelancerApi = {
  getAll: (page = 1, pageSize = 10, search = null) => {
    let url = `/freelancers/paged?pageNumber=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return api.get(url);
  },

  getById: (id) => 
    api.get(`/freelancers/${id}`),
  
  create: (freelancer) => 
    api.post('/freelancers', freelancer),
  
  update: (id, freelancer) => 
    api.patch(`/freelancers/${id}`, freelancer),
  
  delete: (id) => 
    api.delete(`/freelancers/${id}`),
   
  archive: (id, isArchived) => 
    api.patch(`/freelancers/${id}/archive`, { isArchived }),

 getOptions: () => 
  api.get('/freelancers/options'), 
};