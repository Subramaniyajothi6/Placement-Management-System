const studentController ={

     createStudent: async (req, res) =>{
        res.send('create student');
     },
     getAllStudents: async (req, res) =>{
        res.send('get all students');
     },  
     getStudentById: async (req, res) =>{
        res.send(`Get student with ID: ${req.params.id}`);
     },  
     updateStudent: async (req, res) =>{
        res.send(`Update student with ID: ${req.params.id}`);
     },  
     deleteStudent: async (req, res) =>{
        res.send(`Delete student with ID: ${req.params.id}`);
     },  
}

module.exports = studentController;