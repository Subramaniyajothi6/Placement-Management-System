const PlacementDrive = require("../models/PlacementDrive");

const placementDriveController = {
    createPlacementDrive:async (req,res)=>{try {
        const placementDrive = await PlacementDrive.create(req.body);
        res.status(201).json({success:true,data:placementDrive,message:"Placement Drive created successfully"});
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }},
    getAllPlacementDrives: async (req,res)=>{try {

       const placementDrive = await PlacementDrive.find();
       res.status(200).json({success:true,count:placementDrive.length,data:placementDrive});

    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }},
    getSinglePlacementDrive:async(req,res)=>{try {
        const placementDrive = await PlacementDrive.findById(req.params.id);
        if(!placementDrive){
            return res.status(404).json({success:false,message:'Placement Drive not found'});
        }
        res.status(200).json({success:true,data:placementDrive});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    updatePlacementDrive:(req,res)=>{try {
        res.send(`Update placement drive with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    deletePlacementDrive:(req,res)=>{try {
        res.send(`Delete placement drive with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
};

module.exports = placementDriveController;