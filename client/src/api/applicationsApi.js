import axiosClient from "./axiosClient";
const applicationApi = {
    createApplication: (data) => axiosClient.post('/application', data),
    getApplications: () => axiosClient.get('/application'),
    getMyApplications: () => axiosClient.get('/application/my'),
    getCompanyApplications: () => axiosClient.get('/application/company'),
    getById: (id) => axiosClient.get(`/application/${id}`),
    updateApplication: (id, data) => axiosClient.put(`/application/${id}`, data),
    deleteApplication: (id) => axiosClient.delete(`/application/${id}`),
    getApplicationStatusCounts: () =>
        axiosClient.get('/application/reports/application-status-counts'),

}
export default applicationApi;