import axios from 'axios';
import { data } from 'react-router-dom';


const API_BASE_URL = 'https://localhost:60300/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
  logout: () =>
    api.post('/Auth/logout'),
  getCurrentUser: () =>
    api.get('/Auth/me'),
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

 

};

 export const hobbyApi = {
 getHobby: () => 
  api.get('/Hobby'), 

 CreateHobby : (data) =>
  api.post('/Hobby',data),

 DeleteHobby : (id) =>
  api.delete(`/Hobby/${id}`),

 updateHobby : (id, data) =>
  api.patch(`/Hobby/${id}`, data),
};

export const skillsetApi = {
  getSkillset: () => 
    api.get('/Skill'),
  
  create: (data) => 
    api.post('/Skill', data),
  
  delete: (id) => 
    api.delete(`/Skill/${id}`),
  update: (id, data) =>
    api.patch(`/Skill/${id}`, data),
};