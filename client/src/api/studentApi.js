import axiosClient from "./axiosClient";

const studentApi = {

    create: (data)=> axiosClient.post('/student',data),

    getAll:()=> axiosClient.get('/student'),

    getById:(id)=> axiosClient.get(`/student/${id}`),

    update:(id,data)=>axiosClient.put(`/student/${id}`,data),

    delete:(id)=> axiosClient.delete(`/student/${id}`),
}

export default studentApi ; 