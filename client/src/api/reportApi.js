import axiosClient from "./axiosClient";

const reportApi = {

    createReport: (data) => axiosClient.post('/report', data),

    getAllReports: () => axiosClient.get('/report'),

    getReportById: (id) => axiosClient.get(`/report/${id}`),

    updateReport: (id, data) => axiosClient.put(`/report/${id}`, data),

    deleteReport: (id) => axiosClient.delete(`/report/${id}`),

}
export default reportApi
