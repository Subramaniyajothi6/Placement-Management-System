import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'https://placement-management-system-9vxu.onrender.com/api/v1',
    // baseURL: 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient