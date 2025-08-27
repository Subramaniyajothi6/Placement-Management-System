const Report = require("../models/Report");

const reportController = {
    createReport: async (req, res) => {
        try {
            const report = await Report.create(req.body);
            res.status(201).json({ success: true, data: report, message: 'Report created successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getAllReports: async (req, res) => {
        try {
            const reports = await Report.find().sort({ startDate: -1 }).populate({
                path: 'placementDrive', model: 'PlacementDrive'
            });
            console.log('Reports with populated placementDrive:', reports);
            res.status(200).json({ success: true, count: reports.length, data: reports });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getReportById: async (req, res) => {
        try {
            const report = await Report.findById(req.params.id);
            if (!report) {
                return res.status(404).json({ success: false, message: 'Report not found' });
            }
            res.status(200).json({ success: true, data: report });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateReport: async (req, res) => {
        try {
            const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!report) {
                return res.status(404).json({ success: false, message: 'Report not found' });
            }
            res.status(200).json({ success: true, data: report, message: 'Report updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    deleteReport: async (req, res) => {
        try {
            const report = await Report.findByIdAndDelete(req.params.id);
            if (!report) {
                return res.status(404).json({ success: false, message: 'Report not found' });
            }
            res.status(200).json({ success: true, message: 'Report deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = reportController;
