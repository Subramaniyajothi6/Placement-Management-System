const express = require('express');
const app = express();

const cors = require('cors');
const logger = require('./utils/logger');
const errorRoute = require('./utils/errorRoute');
const authRouter = require('./routes/authRouter');
const studentRouter = require('./routes/studentRoutes');


app.use(cors({
    origin: 'http://localhost:3000',
    methods:['GET','POST', 'DELETE', 'UPDATE', 'PUT'],
    credentials:true
}))


app.use(express.json());

app.use(logger)

app.use('/api/v1/auth' ,authRouter)
app.use('/api/v1/student',studentRouter);


app.use(errorRoute);

module.exports = app;