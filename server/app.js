const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./utils/logger');
const errorRoute = require('./utils/errorRoute');
const authRouter = require('./routes/authRouter');
const studentRouter = require('./routes/studentRoutes');
const companyRouter = require('./routes/companyRoutes');
const interviewRouter = require('./routes/interviewRoutes');
const applicationRouter = require('./routes/applicationRoutes');
const placementDriveRouter = require('./routes/placementDriveRoutes');
const jobRouter = require('./routes/jobRoutes');
const cookieParser = require('cookie-parser');


app.use(cors({
    origin: ['http://localhost:3000','https://placement-management-system-2d32.onrender.com'],
    methods:['GET','POST', 'DELETE', 'UPDATE', 'PUT'],
    credentials:true
}))

app.use(cookieParser());    

app.use(express.json());

app.use(logger)

app.use('/api/v1/auth' ,authRouter)
app.use('/api/v1/student',studentRouter);
app.use('/api/v1/company',companyRouter);
app.use('/api/v1/placementDrive',placementDriveRouter);
app.use('/api/v1/interview',interviewRouter);
app.use('/api/v1/application',applicationRouter);
app.use('/api/v1/job',jobRouter);



app.use(errorRoute);

module.exports = app;