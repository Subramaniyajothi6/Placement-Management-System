import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import  interviewApi from "../api/interviewsApi";

export const createInterview = createAsyncThunk(
    'interview/createInterview',
    async (data, { rejectWithValue }) => {
        try {
            const response = await interviewApi.createInterview(data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchInterviews = createAsyncThunk(
    'interview/fetchInterviews',
    async (_, { rejectWithValue }) => {
        try {
            const response = await interviewApi.getInterviews();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchMyInterviews = createAsyncThunk(
    'interview/fetchMyInterviews',
    async (_, { rejectWithValue }) => {
        try {
            console.log('fetchMyInterviews THUNK: started');
            const response = await interviewApi.getMyInterviews();
            console.log('Interviews fetched from API:', response.data.data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const fetchInterviewById = createAsyncThunk(
    'interview/fetchInterviewById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await interviewApi.getInterviewById(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const updateInterview = createAsyncThunk(
    'interview/updateInterview',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await interviewApi.updateInterview(id, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const deleteInterview = createAsyncThunk(
    'interview/deleteInterview',
    async (id, { rejectWithValue }) => {
        try {
            await interviewApi.deleteInterview(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message
                || error.message)
        }
    }
)

const interviewSlice = createSlice({
    name: 'interview',
    initialState: {
        interviews: [],
        interview: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
    },
    reducers: {

        clearInterviewError(state) {
            state.isError = false;
            state.message = '';
        },
        clearSelectedInterview(state) {
            state.interview = null;
        },
        clearSuccess: (state) => {
            state.isSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder

            // Create Interview 

            .addCase(createInterview.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(createInterview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.interviews.push(action.payload);
                state.isSuccess = true;
            })
            .addCase(createInterview.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })

            //  fetch
            .addCase(fetchInterviews.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(fetchInterviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.interviews = action.payload;
                state.isSuccess = true;
            })
            .addCase(fetchInterviews.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;

            })
            // fecth my interviews
            .addCase(fetchMyInterviews.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(fetchMyInterviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.interviews = action.payload;
                state.isSuccess = true;
            })
            .addCase(fetchMyInterviews.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })

            // fetch by id 

            .addCase(fetchInterviewById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(fetchInterviewById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.interview = action.payload;
                state.isSuccess = true;
            })
            .addCase(fetchInterviewById.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })

            // update
            .addCase(updateInterview.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(updateInterview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.interviews = state.interviews.map((interview) =>
                    interview._id === action.payload._id ? action.payload : interview
                )
                state.isSuccess = true;
            })
            .addCase(updateInterview.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })


            //  delete 

            .addCase(deleteInterview.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(deleteInterview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.interviews = state.interviews.filter((interview) =>
                    interview._id !== action.payload)
                state.isSuccess = true;
            })
            .addCase(deleteInterview.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
}
)

export default interviewSlice.reducer;
export const { clearInterviewError, clearSelectedInterview, clearSuccess } = interviewSlice.actions;


export const selectCurrentInterview = (state) => state.interview.interview;

export const selectInterviewById = (state, id) =>
    state.interview.interviews.find((interview) => interview._id === id);

export const selectAllInterviews = (state) => state.interview.interviews;
export const selectInterviewLoading = (state) => state.interview.isLoading;
export const selectInterviewError = (state) => state.interview.isError;

export const selectInterviewsByCompany = (state, companyId) =>
    state.interview.interviews.filter((i) => i.companyId === companyId);

export const selectInterviewsByStudent = createSelector(
  (state) => state.interview.interviews,
  (_, studentId) => studentId,
  (interviews, studentId) =>
    interviews.filter(
      (i) =>
        (typeof i.candidate === 'string' ? i.candidate : i.candidate?._id) === studentId
    )
);