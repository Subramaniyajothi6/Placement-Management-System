const Interview = require("../models/Interview");

const interviewController = {
    createInterview: async (req, res) => {
        try {

            const interview = await Interview.create(req.body);
            res.status(201).json({ success: true, data: interview, message: "Interview created successfully" });

        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ success: false, message: messages });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getAllInterviews: async (req, res) => {
        try {
            const interviews = await Interview.find();
            res.status(200).json({ success: true, count: interviews.length, data: interviews });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getMyInterviews: async (req, res) => {
        try {
            const interviews = await Interview.find({ candidate: req.user.id })
                .populate('job', 'title placementDrive')
                .populate('company', 'name');
            res.status(200).json({ success: true, count: interviews.length, data: interviews });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getSingleInterview: async (req, res) => {
        try {
            const interview = await Interview.findById(req.params.id);
            if (!interview) {
                return res.status(404).json({ success: false, message: 'Interview not found' })
            }
            res.status(200).json({ success: true, data: interview, message: "Interview found successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateInterview: async (req, res) => {
        try {
            const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!interview) {
                return res.status(404).json({ success: false, message: 'Interview not found' })
            }
            res.status(200).json({ success: true, data: interview, message: "Interview updated successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteInterview: async (req, res) => {
        try {

            const interview = await Interview.findByIdAndDelete(req.params.id);
            if (!interview) {
                return res.status(404).json({ success: false, message: "Interview not found" });
            }
            res.status(200).json({ success: true, data: interview, message: 'Interview deleted successfully' });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

};

module.exports = interviewController;
