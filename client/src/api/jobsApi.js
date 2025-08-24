import axiosClient from "./axiosClient";


const jobsApi = {

    create: (data) => axiosClient.post('/jobs',data),

    getAll:()=> axiosClient.get('/jobs'),

    getById:(id)=> axiosClient.get(`/jobs/${id}`),

    update:(id,data)=>axiosClient.put(`/jobs/${id}`,data),

    delete:(id)=>axiosClient.delete(`/jobs/${id}`)
}

export default jobsApi;
