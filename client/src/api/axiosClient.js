import axios from "axios";

const axiosClient = axios.create({
    baseURL:'https://placement-management-system-2d32.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient