const PlacementDrive = require("../models/PlacementDrive");

const placementDriveController = {
    createPlacementDrive: async (req, res) => {
        try {
            const placementDrive = await PlacementDrive.create(req.body);
            res.status(201).json({ success: true, data: placementDrive, message: "Placement Drive created successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getAllPlacementDrives: async (req, res) => {
        try {

            const placementDrives = await PlacementDrive.find();
            res.status(200).json({ success: true, count: placementDrives.length, data: placementDrives });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getSinglePlacementDrive: async (req, res) => {
        try {
            const placementDrive = await PlacementDrive.findById(req.params.id);
            if (!placementDrive) {
                return res.status(404).json({ success: false, message: 'Placement Drive not found' });
            }
            res.status(200).json({ success: true, data: placementDrive });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updatePlacementDrive: async (req, res) => {
        try {
            const { startDate, endDate } = req.body; // extract from request

            if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
                return res.status(400).json({
                    success: false,
                    message: "End date must be later than start date"
                });
            }


            const placementDrive = await PlacementDrive.findById(req.params.id);

            if (!placementDrive) {
                return res.status(404).json({
                    success: false,
                    message: 'Placement Drive not found'
                });
            }
            Object.assign(placementDrive, req.body);

            await placementDrive.save();

            res.status(200).json({
                success: true,
                data: placementDrive,
                message: "Placement Drive updated successfully"
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    deletePlacementDrive: async (req, res) => {
        try {
            const placementDrive = await PlacementDrive.findByIdAndDelete(req.params.id);
            if (!placementDrive) {
                return res.status(404).json({ success: false, message: 'Placement Drive not found' });
            }
            res.status(200).json({ success: true, message: "Placement Drive deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = placementDriveController;