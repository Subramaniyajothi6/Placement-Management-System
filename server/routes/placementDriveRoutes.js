const express = require('express');
const { createPlacementDrive, getAllPlacementDrives, getSinglePlacementDrive, updatePlacementDrive, deletePlacementDrive } = require('../controllers/placementDriveController');

const placementDriveRouter = express.Router();

placementDriveRouter.post('/',createPlacementDrive);
placementDriveRouter.get('/',getAllPlacementDrives);
placementDriveRouter.get('/:id',getSinglePlacementDrive);
placementDriveRouter.put('/:id',updatePlacementDrive);
placementDriveRouter.delete('/:id',deletePlacementDrive);



module.exports = placementDriveRouter;