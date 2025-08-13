const express = require('express');
const { createInterview, getAllInterviews, getSingleInterview, updateInterview, deleteInterview } = require('../controllers/interviewController');

const interviewRouter = express.Router();

interviewRouter.post('/',createInterview);
interviewRouter.get('/',getAllInterviews);
interviewRouter.get('/:id',getSingleInterview);
interviewRouter.put('/:id',updateInterview);
interviewRouter.delete('/:id',deleteInterview);



module.exports = interviewRouter;