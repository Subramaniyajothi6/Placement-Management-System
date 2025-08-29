const CompanyProfile = require("../models/CompanyProfile");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const User = require("../models/User");
const companyController = {

    createCompany: async (req, res) => {
        try {
            const existingCompany = await CompanyProfile.findOne({ user: req.body.user });
            if (existingCompany) {
                return res.status(400).json({ success: false, message: 'User already has a company profile.' });
            }

            const company = await CompanyProfile.create(req.body);
            await User.findByIdAndUpdate(company.user, { companyId: company._id });

            res.status(201).json({
                success: true,
                message: 'Company Created Successfully',
                data: company,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getAllCompanies: async (req, res) => {
        try {
            const companies = await CompanyProfile.find();
            res.status(200).json({
                success: true,
                count: companies.length,
                data: companies
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getCompanyById: async (req, res) => {
        try {
            const company = await CompanyProfile.findById(req.params.id);
            if (!company) {
                return res.status(404).json({ success: false, message: 'Company not found' })
            }
            res.status(200).json(
                {
                    success: true,
                    message: 'Company Fetched Successfully',
                    data: company
                });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateCompany: async (req, res) => {
        try {
            const company = await CompanyProfile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!company) {
                return res.status(404).json({ success: false, message: 'Company not found' });
            }
            res.status(200).json({
                success: true,
                message: 'Company Updated Successfully',
                data: company
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    deleteCompany: async (req, res) => {
        try {
            const company = await CompanyProfile.findByIdAndDelete(req.params.id);
            if (!company) {
                return res.status(404).json({ success: false, message: 'Company not found' });
            }
            res.status(200).json({ success: true, message: 'Company deleted successfully' });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    companyDashboard: async (req, res) => {
        try {
            const companyId = req.user.id;
            if (!companyId) {
                return res.status(400).json({ success: false, message: 'Company ID is required' });
            }
            const jobsPosted = await Job.countDocuments({ company: companyId });

            const applicationsReceived = await Application.countDocuments({ company: companyId });
            const upcomingInterviews = await Interview.countDocuments({
                company: companyId,
                interviewDate: { $gte: new Date() }
            });

            res.status(200).json({
                success: true,
                data: { jobsPosted, applicationsReceived, upcomingInterviews }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

}

module.exports = companyController;