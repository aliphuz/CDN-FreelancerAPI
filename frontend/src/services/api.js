import axios from 'axios';


const API_BASE_URL = 'https://localhost:60300/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((configs) => {
  const token = localStorage.getItem('token');
  if (token) {
    configs.headers.Authorization = `Bearer ${token}`;
  }
  return configs;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);


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

 getHobby: () => 
  api.get('/Hobby'), 

  getSkillset: () =>
    api.get('/Skill'),
};