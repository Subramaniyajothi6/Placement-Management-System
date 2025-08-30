import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
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
        success: false,
        message: null,
    },

    reducers: {
        resetStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.message = null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.success = true;
            })
            .addCase(fetchApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                state.message = action.payload;
            })

            .addCase(fetchMyApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
            })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.success = true;
                state.message = "Fetched my applications successfully";
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                state.message = action.payload;
            })

            .addCase(fetchCompanyApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;

            })
            .addCase(fetchCompanyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.success = true;
                state.message = "Fetched company applications successfully";
            })
            .addCase(fetchCompanyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                state.message = action.payload;
            })

            // create

            .addCase(createApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;

            })
            .addCase(createApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
                state.success = true;
                state.message = "Application created successfully";
            })
            .addCase(createApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                state.message = action.payload;
            })

            // update

            .addCase(updateApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
            })

            .addCase(updateApplication.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((app) => app._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.success = true;
                state.message = "Application updated successfully";
            })

            .addCase(updateApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                state.message = action.payload;
            })

            .addCase(deleteApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;

            })
            .addCase(deleteApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((app) => app._id !== action.payload);
                state.success = true;
                state.message = "Application deleted successfully";
            })
            .addCase(deleteApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                state.message = action.payload;
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
export const selectApplicationsByStudent = createSelector(
    [selectAllApplications, (state, studentId) => studentId],
    (applications, studentId) => applications.filter(app =>
        app.candidate === studentId || app.candidate?._id === studentId
    )
);
export const selectApplicationsByJob = (state, jobId) =>
    state.applications.items.filter((app) => app.job._id === jobId);
export const selectApplicationsByCompany = (state, companyId) =>
    state.applications.items.filter((app) => app.job.company._id === companyId);