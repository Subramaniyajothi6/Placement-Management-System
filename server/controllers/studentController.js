const StudentProfile = require("../models/StudentProfile");

const studentController = {

   createStudent: async (req, res) => {
      try {
         const student = new StudentProfile(req.body);
         await student.save();
         res.status(201).json({ success: true, data: student });
      } catch (error) {
         res.status(500).json({ success: false, message: error.message });
      }
   },
   getAllStudents: async (req, res) => {
      try {
         const students = await StudentProfile.find();
         if (!students) {
            return res.status(404).json({ success: false, message: "No student found" })
         }

         res.status(200).json({ success: true, data: students })

      } catch (err) {
         res.status(500).json({ success: false, message: err.message });

      }
   },
   getStudentById: async (req, res) => {
      try {
         const student = await StudentProfile.findById(req.params.id)
            .populate('userId', 'name email');
         if (!student) {
            return res.status(404).json({ success: false, message: "student not found" })
         }
         res.status(200).json({ success: true, data: student })
      } catch (err) {
         res.status(500).json({ success: false, message: err.message });

      }
   },
   updateStudent: async (req, res) => {
      try {
         const student = await StudentProfile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
         if (!student) {
            return res.status(404).json({ success: false, message: 'student not found' })
         }
         res.status(200).json({ success: true, data: student })
      } catch (err) {
         res.status(500).json({ success: false, message: err.message });
      }
   },
   deleteStudent: async (req, res) => {
      try {
         const student = await StudentProfile.findByIdAndDelete(req.params.id);
         if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' })
         }
         res.status(200).json({ success: true, data: student });
      } catch (err) {
         res.status(500).json({ success: false, message: err.message })
      }
   },


uploadResumeFile: async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: 'No resume file uploaded' });
    }
    res.json({ success: true, url: req.file.path });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


}

module.exports = studentController;