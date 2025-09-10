const express = require('express');
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, uploadResumeFile } = require('../controllers/studentController');
const uploadResume = require('../middleware/uploadResume');
const { authMiddleware } = require('../middleware/authMiddleware');

const studentRouter = express.Router();

studentRouter.post('/',createStudent);
studentRouter.get('/',getAllStudents);
studentRouter.post('/uploadResume',authMiddleware,uploadResume,uploadResumeFile,); 
studentRouter.get('/:id',getStudentById);
studentRouter.put('/:id',updateStudent);
studentRouter.delete('/:id',deleteStudent);


module.exports = studentRouter;