import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import applicationApi from "../api/applicationsApi";

export const fetchApplications = createAsyncThunk(
    'applications/fetchApplications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await applicationApi.getApplications();
            console.log("Applications API response:", response);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchMyApplications = createAsyncThunk(
    'applications/fetchMyApplications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await applicationApi.getMyApplications();
           return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCompanyApplications = createAsyncThunk(
    'applications/fetchCompanyApplications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await applicationApi.getCompanyApplications();
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



export const createApplication = createAsyncThunk(
    'applications/createApplication',
    async (data, { rejectWithValue }) => {
        try {
            const response = await applicationApi.createApplication(data);
            return response.data.data || response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const updateApplication = createAsyncThunk(
    'applications/updateApplication',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await applicationApi.updateApplication(id, data);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const deleteApplication = createAsyncThunk(
    'applications/deleteApplication',
    async (id, { rejectWithValue }) => {
        try {
            await applicationApi.deleteApplication(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const getApplicationById = createAsyncThunk(
    'applications/getApplicationById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await applicationApi.getById(id);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }   
    }
)

const applicationSlice = createSlice({
    name: 'applications',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },

    reducers: {
        resetStatus: (state) => {
            state.loading = false;
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
        
            .addCase(fetchMyApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchCompanyApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCompanyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // create

            .addCase(createApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
        .addCase(createApplication.fulfilled, (state, action) => {
            state.loading = false;
            state.items.push(action.payload);
        })
        .addCase(createApplication.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // update

        .addCase(updateApplication.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(updateApplication.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.items.findIndex((app) => app._id === action.payload._id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        })

        .addCase(updateApplication.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(deleteApplication.pending, (state) => {
            state.loading = true;
            state.error = null;

        })
        .addCase(deleteApplication.fulfilled, (state, action) => {
            state.loading = false;
            state.items = state.items.filter((app) => app._id !== action.payload);
        })
        .addCase(deleteApplication.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
}
})


export default applicationSlice.reducer;
export const { resetStatus } = applicationSlice.actions;
export const selectAllApplications = (state) => state.applications.items;
export const selectApplicationLoading = (state) => state.applications.loading;
export const selectApplicationError = (state) => state.applications.error;
export const selectApplicationById = (state, applicationId) =>
    state.applications.items.find((app) => app._id === applicationId);
export const selectApplicationsByStudent = (state, studentId) =>
    state.applications.items.filter((app) => app.student._id === studentId);
export const selectApplicationsByJob = (state, jobId) =>
    state.applications.items.filter((app) => app.job._id === jobId);
export const selectApplicationsByCompany = (state, companyId) =>
    state.applications.items.filter((app) => app.job.company._id === companyId);