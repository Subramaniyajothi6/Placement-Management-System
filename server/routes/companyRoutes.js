const express = require('express');
const { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany, companyDashboard } = require('../controllers/companyController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const companyRouter = express.Router();


companyRouter.post('/', createCompany)
companyRouter.get('/', getAllCompanies)
companyRouter.get('/:id', getCompanyById)
companyRouter.put('/:id', updateCompany)
companyRouter.delete('/:id', deleteCompany)



companyRouter.get('/dashboard',authMiddleware,roleMiddleware(['company']), companyDashboard);

module.exports = companyRouter;