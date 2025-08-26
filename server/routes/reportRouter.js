const express = require('express');
const { createReport, getAllReports, getReportById, updateReport, deleteReport } = require('../controllers/reportController');
const reportRouter = express.Router();

reportRouter.post('/', createReport);
reportRouter.get('/', getAllReports);
reportRouter.get('/:id', getReportById);
reportRouter.put('/:id', updateReport);
reportRouter.delete('/:id', deleteReport);

module.exports = reportRouter;
