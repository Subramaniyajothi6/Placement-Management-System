const express = require('express');
const { getAllJobs, getSingleJob,  createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { roleMiddleware, authMiddleware } = require('../middleware/authMiddleware');

const jobRouter = express.Router();

jobRouter.post('/', authMiddleware, roleMiddleware(['company']), createJob); 

jobRouter.get('/',getAllJobs);

jobRouter.get('/:id',getSingleJob);

jobRouter.put('/:id',updateJob);

jobRouter.delete('/:id',deleteJob);

module.exports=jobRouter;