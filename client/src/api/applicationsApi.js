import axiosClient from "./axiosClient";
const applicationApi = {
    create: (data) => axiosClient.post('/application', data),
    getAll: () => axiosClient.get('/application'),
    getMyApplications: () => axiosClient.get('/application/my'),
    getCompanyApplications: () => axiosClient.get('/application/company'),
    getById: (id) => axiosClient.get(`/application/${id}`),
    update: (id, data) => axiosClient.put(`/application/${id}`, data),
    delete: (id) => axiosClient.delete(`/application/${id}`)
}
export default applicationApi;