import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import studentApi from "../api/studentApi";

export const createStudent = createAsyncThunk(
    'student/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await studentApi.create(data)
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)
export const fetchStudents = createAsyncThunk(
    'student/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await studentApi.getAll();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)
export const fetchStudentById = createAsyncThunk(
    'student/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await studentApi.getById(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const updateStudent = createAsyncThunk(
    'student/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await studentApi.update(id, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const deleteStudent = createAsyncThunk(
    'student/deleteStudent',
    async (id, { rejectWithValue }) => {
        try {
            await studentApi.delete(id)
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const uploadStudentResume = createAsyncThunk(
  'student/uploadResume',
  async ({ file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await studentApi.uploadResume(formData); // no id needed
      return response.data.url; // just the URL string
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const studentSlice = createSlice({
    name: 'student',
    initialState: {
        students: [],
        selectedStudent: null,
        applications: [],
        interviews: [],
        drives: [],
        companies: [],
        jobs: [],
        stats: {},
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedStudent: (state) => {
            state.selectedStudent = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.students.push(action.payload);
            })
            .addCase(createStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

                // fetch all
            })
            .addCase(fetchStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetch by id

            .addCase(fetchStudentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedStudent = action.payload;
            })
            .addCase(fetchStudentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // update student

            .addCase(updateStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.students.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.students[index] = action.payload;
                }
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //  delete student

            .addCase(deleteStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.students = state.students.filter(item => item._id !== action.payload)
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(uploadStudentResume.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadStudentResume.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.students.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.students[index] = action.payload;
                }
                state.selectedStudent = action.payload; // update selected too if needed
            })
            .addCase(uploadStudentResume.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearSelectedStudent } = studentSlice.actions;
export default studentSlice.reducer
export const selectStudents = (state) => state.student.students;
export const selectSelectedStudent = (state) => state.student.selectedStudent;
export const selectStudentLoading = (state) => state.student.loading;
export const selectStudentError = (state) => state.student.error;