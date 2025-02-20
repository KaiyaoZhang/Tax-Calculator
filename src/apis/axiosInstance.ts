import axios, { AxiosInstance } from "axios";

// Create an Axios instance with custom configuration
const instance: AxiosInstance = axios.create({
  // Base URL for all API requests – can be set through environment variables or fallback to localhost
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5001",
  // Set timeout limit (in milliseconds) for requests
  timeout: 100000,
  // Default headers for every request made using this instance
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
