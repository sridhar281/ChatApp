import axios from 'axios';
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002/api', // Adjust the base URL as needed
  withCredentials: true, // Include credentials for cross-origin requests
});