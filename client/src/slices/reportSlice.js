import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reportApi from "../api/reportApi";


export const fetchReports = createAsyncThunk(
    'report/fetchReports',
    async (_, { rejectWithValue }) => {
        try {
            const response = await reportApi.getAllReports();
            return response.data.data;  // Adjust if your API response differs
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createReport = createAsyncThunk(
    'report/createReport',
    async (data, { rejectWithValue }) => {
        try {
            const response = await reportApi.createReport(data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchReportById = createAsyncThunk(
    'report/fetchReportById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await reportApi.getReportById(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateReport = createAsyncThunk(
    'report/updateReport',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await reportApi.updateReport(id, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteReport = createAsyncThunk(
    'report/deleteReport',
    async (id, { rejectWithValue }) => {
        try {
            await reportApi.deleteReport(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    reports: [],
    selectedReport: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    selectedLoading: false,
    selectedError: false,
    selectedMessage: '',
};

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        resetReportState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
            state.selectedReport = null;
            state.selectedLoading = false;
            state.selectedError = false;
            state.selectedMessage = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReports.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reports = action.payload;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload;
            })
            // createReport cases
            .addCase(createReport.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(createReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reports.push(action.payload);
                state.message = 'Report created successfully';
            })
            .addCase(createReport.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })

            // fetchReportById cases

            .addCase(fetchReportById.pending, (state) => {
                state.selectedLoading = true;
                state.selectedError = false;
                state.selectedMessage = '';
                state.selectedReport = null;
            })
            .addCase(fetchReportById.fulfilled, (state, action) => {
                state.selectedLoading = false;
                state.selectedReport = action.payload;
            })
            .addCase(fetchReportById.rejected, (state, action) => {
                state.selectedLoading = false;
                state.selectedError = true;
                state.selectedMessage = action.payload;
                state.selectedReport = null;
            })

            // updateReport cases
            .addCase(updateReport.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(updateReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reports = state.reports.map((report) =>
                    report._id === action.payload._id ? action.payload : report
                );
                state.message = 'Report updated successfully';
            })
            .addCase(updateReport.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
            // deleteReport cases
            .addCase(deleteReport.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(deleteReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reports = state.reports.filter((r) => r._id !== action.payload);
                state.message = 'Report deleted successfully';
            })
            .addCase(deleteReport.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});


export const { resetReportState } = reportSlice.actions;
export default reportSlice.reducer;

export const selectAllReports = (state) => state.report.reports;
export const selectReportLoading = (state) => state.report.isLoading;
export const selectReportError = (state) => state.report.isError;
export const selectReportSuccess = (state) => state.report.isSuccess;
export const selectReportMessage = (state) => state.report.message;

// Selectors for single report
export const selectSelectedReport = (state) => state.report.selectedReport;
export const selectSelectedReportLoading = (state) => state.report.selectedLoading;
export const selectSelectedReportError = (state) => state.report.selectedError;
export const selectSelectedReportMessage = (state) => state.report.selectedMessage;