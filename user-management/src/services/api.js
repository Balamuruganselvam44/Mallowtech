import axios from 'axios';

const api = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'reqres-free-v1',
  },
});

export const login = (credentials) => api.post('/login', credentials);

export const getUsers = (page = 1) => api.get(`/users?page=${page}`);
export const getAllUsers = async () => {
  const allUsers = [];
  let page = 1;
  let hasMorePages = true;
  
  while (hasMorePages) {
    try {
      const response = await api.get(`/users?page=${page}`);
      const { data, total_pages } = response.data;
      allUsers.push(...data);
      
      if (page >= total_pages) {
        hasMorePages = false;
      } else {
        page++;
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      hasMorePages = false;
    }
  }
  
  return allUsers;
};
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;
