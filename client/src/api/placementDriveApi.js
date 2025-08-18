import axiosClient from "./axiosClient";


const placementDriveApi = {

    create: (data) => axiosClient.post('/placementDrive',data),

    getAll:()=> axiosClient.get('/placementDrive'),

    getById:(id)=> axiosClient.get(`/placementDrive/${id}`),

    update:(id,data)=> axiosClient.put(`/placementDrive/${id}`, data),

    delete:(id)=> axiosClient.delete(`/placementDrive/${id}`)

}

export default placementDriveApi ;