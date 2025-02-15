import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM5MzYzOTMwLCJleHAiOjE3Mzk5Njg3MzB9.79Gl6_V0slKxLZdHJa4o_xDsjXDv6sKFS6zhvh2z7HE'
  },
  withCredentials: true
});

instance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error);
    return Promise.reject(error);
  }
);

export default instance; 