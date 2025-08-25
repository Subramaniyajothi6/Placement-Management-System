import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import jobApi from '../api/jobsApi';


export const createJob = createAsyncThunk(
    'jobs/createJob',
    async (data, { rejectWithValue }) => {
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
    async (_, { rejectWithValue }) => {
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
    async (id, { rejectWithValue }) => {
        try {
            const response = await jobApi.getById(id)
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const updateJob = createAsyncThunk(
    'jobs/updateJob',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await jobApi.update(id, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const deleteJob = createAsyncThunk(
    'jobs/deleteJob',
    async (id, { rejectWithValue }) => {
        try {
            await jobApi.delete(id)
            return id
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        jobs: [],
        selectedJob: null,
        loading: false,
        error: null
    },
    reducers: {
        
        clearSelectedJob: (state) => {
            state.selectedJob = null;
        },
        clearJobError: (state) => {
            state.error = null;
        },
        resetJobState: (state) => {
            state.loading = false;
            state.error = null;
            state.isSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createJob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isSuccess = false;
            })

            .addCase(createJob.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.jobs.push(action.payload);
            })
            .addCase(createJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetch jobs

            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetch job by id 

            .addCase(fetchJobById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedJob = action.payload;
            })
            .addCase(fetchJobById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // update job
            .addCase(updateJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.jobs.findIndex(
                    (job) => job._id === action.payload._id
                );
                if (index !== -1) {
                    state.jobs[index] = action.payload;
                }

                if (state.selectedJob && state.selectedJob._id === action.payload._id) {
                    state.selectedJob = action.payload;
                }
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //  delete job

            .addCase(deleteJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = state.jobs.filter((job) => job._id !== action.payload)

                if (state.selectedJob && state.selectedJob._id === action.payload) {
                    state.selectedJob = null;
                }
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
}


)

export default jobSlice.reducer;
export const { clearSelectedJob, clearJobError, resetJobState } = jobSlice.actions;
export const selectJobs = (state) => state.jobs.jobs;
export const selectSelectedJob = (state) => state.jobs.selectedJob;
export const selectJobsLoading = (state) => state.jobs.loading;
export const selectJobsError = (state) => state.jobs.error;
export const selectJobsSuccess = (state) => state.jobs.isSuccess;
export const selectJobsState = (state) => state.jobs;
export const selectJobById = (state, jobId) =>
    state.jobs.jobs.find((job) => job._id === jobId);