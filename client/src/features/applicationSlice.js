import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as applicationApi from "../api/applicationApi";

export const fetchApplications = createAsyncThunk(
    'applications/fetchApplications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await applicationApi.getApplications();
            return response.data;
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
            return response.data;

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
            return response.data;
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
            .addCase(deleteApplication.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload;
            })
    }
})


export default applicationSlice.reducer;