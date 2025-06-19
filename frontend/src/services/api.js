import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const axiosInstance = axios.create({
    baseURL:BASE_URL,
    withCredentials:true // important: send the auth cookie
});

export default axiosInstance;