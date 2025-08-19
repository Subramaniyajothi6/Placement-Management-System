import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as companyApi from '../api/companyApi';


export const fetchCompanies = createAsyncThunk(
    'company/fetchCompanies',
    async (_, { rejectWithValue }) => {
        try {
            const response = await companyApi.getCompanies();
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const createCompany = createAsyncThunk(
    'company/createCompany',
    async (data, { rejectWithValue }) => {
        try {
            const response = await companyApi.addCompany(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const initialState = {
    companies: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};


const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        resetCompanyState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanies.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.companies = action.payload;
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload || action.error.message;
            })
            .addCase(createCompany.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(createCompany.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.companies.push(action.payload);
                state.message = 'Company created successfully';
            })
            .addCase(createCompany.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload || action.error.message;
            });
    }
});

export const { resetCompanyState } = companySlice.actions;
export default companySlice.reducer;