const express = require('express');
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, uploadResumeFile } = require('../controllers/studentController');
const uploadResume = require('../middleware/uploadResume');
const { authMiddleware } = require('../middleware/authMiddleware');

const studentRouter = express.Router();

studentRouter.post('/',createStudent);
studentRouter.get('/',getAllStudents);
studentRouter.get('/:id',getStudentById);
studentRouter.put('/:id',updateStudent);
studentRouter.delete('/:id',deleteStudent);
studentRouter.post('/:id/uploadResume',authMiddleware,uploadResume,uploadResumeFile,);


module.exports = studentRouter;