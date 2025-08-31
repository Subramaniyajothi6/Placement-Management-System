const { default: mongoose } = require("mongoose");
const Interview = require("../models/Interview");
const User = require("../models/User");

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
            res.status(200).json({ success: true, count: interviews.length, data: interviews });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getCompanyInterviews: async (req, res) => {
        try {
            const companyId = req.user.companyId;
            console.log("companyId :", companyId);

            if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
                return res.status(400).json({ success: false, message: "Invalid or missing company ID" });
            }

            try {
                const interviews = await Interview.aggregate([
                    {
                        $lookup: {
                            from: "Jobs",
                            localField: "job",
                            foreignField: "_id",
                            as: "jobDetails",
                        },
                    },
                    { $unwind: "$jobDetails" },
                    { $match: { "jobDetails.company": mongoose.Types.ObjectId.createFromHexString(companyId) } },
                ]);
                console.log("interviews", interviews);
                return res.status(200).json({ success: true, count: interviews.length, data: interviews });
            } catch (aggError) {
                console.error("Aggregation error:", aggError);
                return res.status(500).json({ success: false, message: aggError.message });
            }

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
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
            const updateFields = {
                feedback: req.body.feedback,
                score: req.body.score,
                result: req.body.result,
                status: req.body.status,
                job: req.body.job,
                candidate: req.body.candidate,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                interviewDate: req.body.interviewDate,
                durationMinutes: req.body.durationMinutes,
                interviewType: req.body.interviewType,
                location: req.body.location,
                meetingId: req.body.meetingId,
                round: req.body.round,
            };

            // Clean undefined fields
            Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

            const interview = await Interview.findByIdAndUpdate(
                req.params.id,
                updateFields,
                { new: true, runValidators: true }
            );

            if (!interview) {
                return res.status(404).json({ success: false, message: 'Interview not found' });
            }

            console.log('Interview updated successfully');
            // Optional: sync application status here if needed

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
