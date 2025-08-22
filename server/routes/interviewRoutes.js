const express = require('express');
const { createInterview, getAllInterviews, getSingleInterview, updateInterview, deleteInterview } = require('../controllers/interviewController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const interviewRouter = express.Router();

interviewRouter.post('/',authMiddleware,roleMiddleware(['company,admin']),createInterview);
interviewRouter.get('/',authMiddleware,roleMiddleware(['admin']),getAllInterviews);
interviewRouter.get('/:id',authMiddleware,getSingleInterview);
interviewRouter.put('/:id',authMiddleware,roleMiddleware(['company,admin']),updateInterview);
interviewRouter.delete('/:id',authMiddleware,roleMiddleware(['company,admin']),deleteInterview);
interviewRouter.get('/my',authMiddleware,roleMiddleware(['student']),getMyInterviews)



module.exports = interviewRouter;