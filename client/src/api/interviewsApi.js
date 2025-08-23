import axiosClient from "./axiosClient";


const interviewApi = {

    create: (data)=> axiosClient.post('/interview',data),

    getAll:()=> axiosClient.get('/interview'),

    getMyInterviews:()=> axiosClient.get('/interview/my'),

    getById:(id)=> axiosClient.get(`/interview/${id}`),

    update:(id,data)=> axiosClient.put(`/interview/${id}`,data),

    delete:(id) => axiosClient.delete(`/interview/${id}`)
}

export default interviewApi ; 
