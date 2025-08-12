const express = require('express');
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');

const studentRouter = express.Router();

studentRouter.post('/',createStudent);
studentRouter.get('/',getAllStudents);
studentRouter.get('/:id',getStudentById);
studentRouter.put('/:id',updateStudent);
studentRouter.delete('/:id',deleteStudent);


module.exports = studentRouter;