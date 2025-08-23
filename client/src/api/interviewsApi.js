import axiosClient from "./axiosClient";


const interviewApi = {

    create: (data)=> axiosClient.post('/interview',data),

    getAll:()=> axiosClient.get('/interview'),

    getMyInterviews:()=> {
        console.log('API call to getMyInterviews');
        return axiosClient.get('/interview/my')
    },

    getById:(id)=> axiosClient.get(`/interview/${id}`),

    update:(id,data)=> axiosClient.put(`/interview/${id}`,data),

    delete:(id) => axiosClient.delete(`/interview/${id}`)
}

export default interviewApi ; 
