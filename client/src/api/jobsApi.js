import axiosClient from "./axiosClient";


const jobsApi = {

    create: (data) => axiosClient.post('/job',data),

    getAll:()=> axiosClient.get('/job'),

    getById:(id)=> axiosClient.get(`/job/${id}`),

    update:(id,data)=>axiosClient.put(`/job/${id}`,data),

    delete:(id)=>axiosClient.delete(`/job/${id}`)
}

export default jobsApi;
