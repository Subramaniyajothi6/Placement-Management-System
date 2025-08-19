import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import *as jobApi from '../api/jobApi';


export const createJob = createAsyncThunk(
    'jobs/createJob',
    async(data,{rejectWithValue})=>{
        try {
            
            const response = await jobApi.create(data)
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);            
        }
    }
)

export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async(_,{rejectWithValue})=>{
       try {
        const response = await jobApi.getAll();
        return response.data.data;
       } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message)
       }
    }
)

export const fetchJobById = createAsyncThunk(
    'jobs/fetchJobById',
    async(id,{rejectWithValue})=>{
        try {
        const response = await jobApi.getById(id)
        return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message ||error.message)
        }
    }
)

export const updateJob = createAsyncThunk(
    'jobs/updateJob',
    async({id,data},{rejectWithValue})=>{
        try {
            const response = await jobApi.update(id,data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const deleteJob = createAsyncThunk (
    'jobs/deleteJob',
    async(id,{rejectWithValue})=>{
        try {
            await jobApi.delete(id)
            return id 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message ||error.message)
        }
    }
)

const jobSlice = createSlice({
    name:'jobs',
    initialState:{
        jobs:[],
        job:null,
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(createJob.pending,(state)=>{
            state.loading = true;
            state.error = null ;
        })

        .addCase(createJob.fulfilled,(state,action)=>{
            state.loading = false;
            state.jobs.push(action.payload);
        })
        .addCase(createJob.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        // fetch jobs

        .addCase(fetchJobs.pending,(state)=>{
            state.loading = true;
            state.error = null ;
        })
        .addCase(fetchJobs.fulfilled,(state,action)=>{
            state.loading = false;
            state.jobs = action.payload;
        })
        .addCase(fetchJobs.rejected,(state,action)=>{
            state.loading = false ;
            state.error = action.payload;
        })

        // fetch job by id 

        .addCase(fetchJobById.pending,(state)=>{
            state.loading = true;
        })
        .addCase(fetchJobById.fulfilled,(state,action)=>{
            state.loading = false;
            state.job = action.payload; 
        })
        .addCase(fetchJobById.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        // update job
        .addCase(updateJob.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updateJob.fulfilled,(state,action)=>{
            state.loading = false;
            state.jobs = state.jobs.map((job)=>
                job._id === action.payload._id ?action.payload :job
            );
        })
        .addCase(updateJob.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        //  delete job

        .addCase(deleteJob.pending,(state)=>{
            state.loading = true;
        })
        .addCase(deleteJob.fulfilled,(state,action)=>{
            state.loading = false;
            state.jobs = state.jobs.filter((job)=>job._id !== action.payload)
        })
        .addCase(deleteJob.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
}


)

export default jobSlice.reducer;