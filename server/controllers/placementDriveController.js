const placementDriveController = {
    createPlacementDrive:(req,res)=>{try {
        res.send('create placement drive')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    getAllPlacementDrives:(req,res)=>{try {
        res.send('get all placement drives')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    getSinglePlacementDrive:(req,res)=>{try {
        res.send(`Get placement drive with ID: ${req.params.id}`)
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