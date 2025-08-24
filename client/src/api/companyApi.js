import axiosClient from "./axiosClient";


const companyApi = {

    create: (data) => axiosClient.post('/company', data),

    getAll: () => axiosClient.get('/company'),

    getDashboard: () => axiosClient.get('/company/dashboard'),
    
    getById: (id) => axiosClient.get(`/company/${id}`),

    update: (id, data) => axiosClient.put(`/company/${id}`, data),

    delete: (id) => axiosClient.delete(`/company/${id}`),


}

export default companyApi;
