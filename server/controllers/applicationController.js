const Application = require("../models/Application");
const applicationEmail = require("../utils/applicationEmail");
// const Job = require("../models/Job");
const applicationController = {

    //  create new application
    createApplication: async (req, res) => {
        try {

            const application = await Application.create(req.body);
            res.status(201).json({ success: true, message: "Application created successfully", data: application });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // get my applications 
    getMyApplications: async (req, res) => {
        try {
            const applications = await Application.find({ candidate: req.user.id })
                .populate('job', 'title placementDrive')
                .populate('company', 'name');
            res.status(200).json({ success: true, count: applications.length, data: applications })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // get company applications 
    getCompanyApplications: async (req, res) => {
        try {
            const filter = { company: req.user.companyId };

            if (req.query.jobId) {
                filter.job = req.query.jobId;
            }
            if (req.query.status) {
                filter.status = req.query.status;
            }

            const applications = await Application.find({ ...filter })
                .populate('job', 'title placementDrive')
                .populate('candidate', 'name email');
            res.status(200).json({ success: true, count: applications.length, data: applications })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // get all applications
    getAllApplications: async (req, res) => {
        try {
            const applications = await Application.find().populate('job', 'title ').populate('company', 'name');
            res.status(200).json({ success: true, count: applications.length, data: applications })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    // get single application
    getSingleApplication: async (req, res) => {
        try {
            const application = await Application.findById(req.params.id);
            if (!application) {
                return res.status(404).json({ success: false, message: "Application not found" })
            }
            res.status(200).json({ success: true, data: application })
            // res.send(`Get application with ID: ${req.params.id}`)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // update application
    updateApplication: async (req, res) => {
        try {
            const application = await Application.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            )
                .populate('candidate', 'name email')   // User model fields
                .populate('job', 'title location');    // Job model fields

                // console.log(application);

            if (!application) {
                return res.status(404).json({ success: false, message: 'Application not found' });
            }
           
            const candidateName = application.candidate?.name || "Candidate";
            const candidateEmail = application.candidate?.email;
            const jobTitle = application.job?.title || "the position";
            


            if (candidateEmail) {
                // Compose email content
                const subject = `Update on your application for ${jobTitle}`;
                const text = `Hello ${candidateName},\n\nYour application status has been  ${application.status}.\n\nThank you for your interest.\n\nBest regards,\nCompany Team`;

                // Send email using your mailer utility (replace this with your mail service)
                await applicationEmail.sendEmail(candidateEmail, subject, text);
            }
          
            
            res.status(200).json({
                success: true,
                message: "Application updated successfully and notification sent.",
                data: application,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // delete application
    deleteApplication: async (req, res) => {
        try {
            const application = await Application.findByIdAndDelete(req.params.id);
            if (!application) {
                return res.status(404).json({ success: false, message: 'Application not found' })
            }

            res.status(200).json({ success: true, message: "Application deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}

module.exports = applicationController