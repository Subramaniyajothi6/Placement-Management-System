const express = require('express');
const { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany } = require('../controllers/companyController');

const companyRouter = express.Router();


companyRouter.post('/',createCompany)
companyRouter.get('/',getAllCompanies)
companyRouter.get('/:id',getCompanyById)
companyRouter.put('/:id',updateCompany)
companyRouter.delete('/:id',deleteCompany)





module.exports = companyRouter;