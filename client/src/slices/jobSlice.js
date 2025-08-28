import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jobsApi from "../api/jobsApi";


// Async thunks
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (data, { rejectWithValue }) => {
    try {
      const response = await jobsApi.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobsApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await jobsApi.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await jobsApi.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue }) => {
    try {
      await jobsApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  error: null,
  success: false,
  message: '',
};

// Slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearSelectedJob: (state) => {
      state.selectedJob = null;
      state.error = null;
      state.success = false;
      state.message = '';
      state.loading = false;
    },
    clearJobError: (state) => {
      state.error = null;
      state.message = '';
      state.success = false;
      state.loading = false;
    },
    resetJobState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.jobs.push(action.payload);
        state.message = 'Job created successfully';
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      })

      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.jobs = action.payload;
        state.message = 'Jobs fetched successfully';
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      })

      // Fetch single job
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedJob = action.payload;
        state.message = 'Job fetched successfully';
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      })

      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.jobs.findIndex((job) => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.selectedJob && state.selectedJob._id === action.payload._id) {
          state.selectedJob = action.payload;
        }
        state.message = 'Job updated successfully';
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      })

      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        if (state.selectedJob && state.selectedJob._id === action.payload) {
          state.selectedJob = null;
        }
        state.message = 'Job deleted successfully';
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      });
  },
});

// Export actions
export const { clearSelectedJob, clearJobError, resetJobState } = jobSlice.actions;

// Export selectors
export const selectJobs = (state) => state.jobs.jobs;
export const selectSelectedJob = (state) => state.jobs.selectedJob;
export const selectJobsLoading = (state) => state.jobs.loading;
export const selectJobsError = (state) => state.jobs.error;
export const selectJobsSuccess = (state) => state.jobs.success;
export const selectJobsMessage = (state) => state.jobs.message;

export default jobSlice.reducer;
