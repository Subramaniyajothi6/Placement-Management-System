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

export const updateCompany = createAsyncThunk(
    'company/updateCompany',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await companyApi.updateCompany(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const deleteCompany = createAsyncThunk(
    'company/deleteCompany',
    async (id, { rejectWithValue }) => {
        try {
            await companyApi.deleteCompany(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const initialState = {
    companies: [],
    selectedCompany: null,
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
            state.selectedCompany = null;
        }
    },

    extraReducers: (builder) => {
        builder

            // fetch
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
                state.message = action.payload;
            })

            // create

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
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })

            // update

            .addCase(updateCompany.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(updateCompany.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.companies = state.companies.map((company) => company._id === action.payload._id ? action.payload : company);
                state.message = 'Company updated successfully';
            })
            .addCase(updateCompany.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })

            // delete

            .addCase(deleteCompany.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.companies = state.companies.filter((company) => company._id !== action.payload);
                state.message = 'Company deleted successfully';
            })
            .addCase(deleteCompany.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { resetCompanyState } = companySlice.actions;
export default companySlice.reducer;

export const selectAllCompanies = (state) => state.company.companies;
export const selectCompanyById = (state) => state.company.selectedCompany;
export const selectCompanyLoading = (state) => state.company.isLoading;
export const selectCompanyError = (state) => state.company.isError;
export const selectCompanySuccess = (state) => state.company.isSuccess;
export const selectCompanyMessage = (state) => state.company.message;
