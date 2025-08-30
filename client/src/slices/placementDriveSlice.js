import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import  placementDriveApi from '../api/placementDriveApi';


export const createPlacementDrive = createAsyncThunk(
    'placementDrive/createPlacementDrive',
    async (data, { rejectWithValue }) => {
        try {
            const response = await placementDriveApi.create(data)
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const fetchPlacementDrives = createAsyncThunk(
    'placementDrives/fetchPlacementDrives',
    async (_, { rejectWithValue }) => {
        try {
            const response = await placementDriveApi.getAll();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)
export const fetchPlacementDriveById = createAsyncThunk(
    'placementDrives/fetchPlacementDriveById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await placementDriveApi.getById(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const updatePlacementDrive = createAsyncThunk(
    'placementDrives/updatePlacementDrive',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await placementDriveApi.update(id, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
);

export const deletePlacementDrive = createAsyncThunk(
    'placementDrives/deletePlacementDrive',
    async (id, { rejectWithValue }) => {
        try {
           await placementDriveApi.delete(id)
           console.log('Deleted placement drive with id:', id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

const placementDriveSlice = createSlice({
    name: 'placementDrive',
    initialState: {
        placementDrives: [],
        selectedPlacementDrive: null,
        loading: false,
        error: null
    },
    reducers: {
        clearPlacementDrive: (state) => {
            state.selectedPlacementDrive = null;
        },
        clearPlacementDriveError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {

        builder
            // create
            .addCase(createPlacementDrive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlacementDrive.fulfilled, (state, action) => {
                state.loading = false;
                state.placementDrives.push(action.payload);
            })
            .addCase(createPlacementDrive.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetch all
            .addCase(fetchPlacementDrives.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlacementDrives.fulfilled, (state, action) => {
                state.loading = false;
                state.placementDrives = action.payload;
            })
            .addCase(fetchPlacementDrives.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetch by id
            .addCase(fetchPlacementDriveById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlacementDriveById.fulfilled, (state, action) => {
                state.loading = false;
                state.placementDrive = action.payload;
            })
            .addCase(fetchPlacementDriveById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // update
            .addCase(updatePlacementDrive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlacementDrive.fulfilled, (state, action) => {
                state.loading = false;
                state.placementDrives = state.placementDrives.map((pd) => pd._id === action.payload._id ? action.payload : pd);
                if (
                    state.selectedPlacementDrive &&
                    state.selectedPlacementDrive._id === action.payload._id
                ) {
                    state.selectedPlacementDrive = action.payload;
                }
            })
            .addCase(updatePlacementDrive.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // delete
            .addCase(deletePlacementDrive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePlacementDrive.fulfilled, (state, action) => {
                state.loading = false;
                state.placementDrives = state.placementDrives.filter((pd) => pd._id !== action.payload);
                if (
                    state.selectedPlacementDrive &&
                    state.selectedPlacementDrive._id === action.payload
                ) {
                    state.selectedPlacementDrive = null;
                }
            })
            .addCase(deletePlacementDrive.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})

export default placementDriveSlice.reducer


export const { clearPlacementDrive , clearPlacementDriveError } = placementDriveSlice.actions;


export const selectPlacementDrives = (state) => state.placementDrive.placementDrives;
export const selectSelectedPlacementDrive = (state) => state.placementDrive.selectedPlacementDrive;
export const selectPlacementDrivesLoading = (state) => state.placementDrive.loading;
export const selectPlacementDrivesError = (state) => state.placementDrive.error;
export const selectPlacementDriveById = (state, id) =>
    state.placementDrive.placementDrives.find((pd) => pd._id === id);   
export const selectPlacementDriveState = (state) => state.placementDrive;
export const selectPlacementDriveMessage = (state) => state.placementDrive.message;
export const selectPlacementDriveSuccess = (state) => state.placementDrive.success;