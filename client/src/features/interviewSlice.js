import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as interviewApi from "../api/interviewApi";



export const createInterview = createAsyncThunk(
    'interview/createInterview',
    async(data, {rejectWithValue})=>{
        try {
            const response = await interviewApi.createInterview(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchInterviews = createAsyncThunk(
    'interview/fetchInterviews',
    async(_,{rejectWithValue})=>{
        try {
            const response = await interviewApi.getInterviews();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchInterviewById = createAsyncThunk(
    'interview/fetchInterviewById',
    async(id,{rejectWithValue})=>{
        try {
            const response = await interviewApi.getInterviewById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const updateInterview = createAsyncThunk(
    'interview/updateInterview',
    async({id,data},{rejectWithValue})=>{
        try {
            const response = await interviewApi.updateInterview(id,data);
            return response.data; 
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);  
        }
    }
)

export const deleteInterview = createAsyncThunk(
    'interview/deleteInterview',
    async(id,{rejectWithValue})=>{
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
    name :'interview',
    initialState:{
        interviews:[],
        interview:null,
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(createInterview.pending,(state)=>{
            state.loading = true;
        })
        .addCase(createInterview.fulfilled,(state,action)=>{
            state.loading = false;
            state.interviews.push(action.payload);
        })
        .addCase(createInterview.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        //  fetch
        .addCase(fetchInterviews.pending,(state)=>{
            state.loading = true;
        })
        .addCase(fetchInterviews.fulfilled,(state,action)=>{
            state.loading = false;
            state.interviews = action.payload;
        })
        .addCase(fetchInterviews.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;

        })

        // fetch by id 

        .addCase(fetchInterviewById.pending,(state)=>{
            state.loading = true;
        })
        .addCase(fetchInterviewById.fulfilled,(state,action)=>{
            state.loading = false;
            state.interview = action.payload;
        })
        .addCase(fetchInterviewById.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        // update
         .addCase(updateInterview.pending,(state)=>{
            state.loading = true;
         })
         .addCase(updateInterview.fulfilled,(state,action)=>{
            state.loading = false;
            state.interviews = state.interviews.map((interview)=>
                interview._id === action.payload._id ? action.payload : interview
            )
         })
         .addCase(updateInterview.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
         })

        
         //  delete 

         .addCase(deleteInterview.pending,(state)=>{
            state.loading = true;
         })
         .addCase(deleteInterview.fulfilled,(state,action)=>{
            state.loading = false;
            state.interviews = state.interviews.filter((interview)=>
            interview._id !== action.payload)
         })
         .addCase(deleteInterview.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
         })
    }
}
)

export default interviewSlice.reducer;