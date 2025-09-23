import axios from 'axios';

const API_BASE_URL = 'https://localhost:60300/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const freelancerApi = {
  getAll: (page = 1, pageSize = 10) => 
    api.get(`/freelancers?page=${page}&pageSize=${pageSize}`),
  
  getById: (id) => 
    api.get(`/freelancers/${id}`),
  
  create: (freelancer) => 
    api.post('/freelancers', freelancer),
  
  update: (id, freelancer) => 
    api.put(`/freelancers/${id}`, freelancer),
  
  delete: (id) => 
    api.delete(`/freelancers/${id}`),
  
  search: (keyword) => 
    api.get(`/freelancers/search?keyword=${keyword}`),
  
  archive: (id, isArchived) => 
    api.patch(`/freelancers/${id}/archive`, { isArchived }),
};