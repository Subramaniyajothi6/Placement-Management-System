const express = require('express');
const { createApplication, getAllApplications, getSingleApplication, updateApplication, deleteApplication, getMyApplications, getCompanyApplications, getApplicationStatusCounts } = require('../controllers/applicationController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const applicationRouter = express.Router();


applicationRouter.post('/',authMiddleware,createApplication);
applicationRouter.get('/my',authMiddleware,roleMiddleware(['student']),getMyApplications);
applicationRouter.get('/company',authMiddleware,roleMiddleware(['company']),getCompanyApplications);
applicationRouter.get('/',authMiddleware,roleMiddleware(['admin']),getAllApplications);
applicationRouter.get('/:id',authMiddleware,getSingleApplication);
applicationRouter.put('/:id',authMiddleware,updateApplication);
applicationRouter.delete('/:id',authMiddleware,deleteApplication);


module.exports = applicationRouter;