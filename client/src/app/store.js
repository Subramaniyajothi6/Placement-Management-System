import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import companyReducer from "../slices/companySlice";
import interviewReducer from "../slices/interviewSlice";
import placementDriveReducer from "../slices/placementDriveSlice";
import studentReducer from "../slices/studentSlice";
import jobReducer from "../slices/jobSlice";
import applicationReducer from "../slices/applicationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    interview: interviewReducer,
    placementDrive: placementDriveReducer,
    student: studentReducer,
    jobs: jobReducer,
    applications: applicationReducer,
   
  },
});
