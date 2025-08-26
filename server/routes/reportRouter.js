const express = require('express');
const { createReport, getAllReports, getReportById, updateReport, deleteReport } = require('../controllers/reportController');
const reportRouter = express.Router();

router.post('/', createReport);
router.get('/', getAllReports);
router.get('/:id', getReportById);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

module.exports = reportRouter;
