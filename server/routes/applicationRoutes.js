const express = require('express');
const { createApplication, getAllApplications, getSingleApplication, updateApplication, deleteApplication } = require('../controllers/applicationController');

const applicationRouter = express.Router();


applicationRouter.post('/',createApplication);
applicationRouter.get('/',getAllApplications);
applicationRouter.get('/:id',getSingleApplication);
applicationRouter.put('/:id',updateApplication);
applicationRouter.delete('/:id',deleteApplication);


module.exports = applicationRouter;