import axiosClient from "./axiosClient";


const interviewApi = {

    createInterview: (data)=> axiosClient.post('/interview',data),

    getInterviews:()=> axiosClient.get('/interview'),

    getMyInterviews:()=> {
        console.log('API call to getMyInterviews');
        return axiosClient.get('/interview/my')
    },

    getCompanyInterviews:()=> axiosClient.get('/interview/company'),

    getInterviewById:(id)=> axiosClient.get(`/interview/${id}`),

    updateInterview:(id,data)=> axiosClient.put(`/interview/${id}`,data),

    deleteInterview:(id) => axiosClient.delete(`/interview/${id}`)
}

export default interviewApi ; 
