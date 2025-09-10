const { default: mongoose } = require("mongoose");
const Interview = require("../models/Interview");
const User = require("../models/User");
const CompanyProfile = require("../models/CompanyProfile");
const { sendInterviewEmail } = require("../utils/emailService"); // Import email util
const Job = require("../models/Job");
const { InterviewEmail } = require("../utils/interviewEmail");

const interviewController = {
  createInterview: async (req, res) => {
    try {
      // Generate unique Jitsi room name using timestamp and candidate ID
      const roomName = `interview-${Date.now()}-${req.body.candidate}`;

      // Construct meeting URL (not strictly necessary here, but useful for logs)
      const meetingUrl = `https://meet.jit.si/${roomName}`;

      // Set meeting details in request body before creating interview
      req.body.meetingId = roomName;
      req.body.platform = 'Jitsi Meet';
      req.body.videoProvider = {
        providerName: 'Jitsi Meet',
        externalMeetingId: roomName,
        meetingUrl: meetingUrl,
      };

      // Save interview document with attachments and all info
      const interview = await Interview.create(req.body);

      // Fetch candidate email to send the interview email
      const candidateUser = await User.findById(interview.candidate).select('email name');
      if (candidateUser) {
        try {
          await InterviewEmail(candidateUser.email, interview);
          console.log('Interview email sent successfully');
        } catch (emailErr) {
          console.error('Error sending interview email:', emailErr);
        }
      }

      console.log('Created Jitsi meeting URL:', meetingUrl);

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
        .populate('job', 'title placementDrive');
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

 updateInterview : async (req, res) => {
  try {
    // Extract update fields from request body
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

    // Remove undefined fields
    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );

    // Update interview document
    const interview = await Interview.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    // Fetch related data for email
    const companyProfile = await CompanyProfile.findOne({ user: req.user.id });
    const job = await Job.findById(interview.job);
    const candidateUser = await User.findById(interview.candidate).select('email name');

    // Determine email type for sending
    const resultStatus = interview.result?.toLowerCase() || 'pending';
    const emailType = resultStatus === 'pending' ? 'schedule' : 'result';
    console.log('Email Type:', emailType);

    // Send email only if candidate user exists
    if (candidateUser) {
      try {
        // Skip sending email if result is 'pending'
        if (resultStatus !== 'pending') {
          await sendInterviewEmail(candidateUser.email, interview, companyProfile, job, emailType);
          console.log('Interview email sent successfully');
        } else {
          console.log('Interview result is pending; no email sent.');
        }
      } catch (emailErr) {
        console.error('Error sending interview email:', emailErr);
      }
    }

    console.log('Interview updated successfully');

    return res.status(200).json({ success: true, data: interview, message: 'Interview updated successfully' });
  } catch (error) {
    console.error('Error updating interview:', error);
    return res.status(500).json({ success: false, message: error.message });
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
