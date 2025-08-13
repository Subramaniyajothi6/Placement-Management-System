const CompanyProfile = require("../models/CompanyProfile");

const companyController = {

    createCompany : async (req ,res) =>{
        try {
            const company = await CompanyProfile.create(req.body);
            return res.status(201).json({company});
        } catch (error) {
            res.status(400).json({message:error.message});
        }
    },
    getAllCompanies : async (req ,res) =>{
        try {
            const companies = await CompanyProfile.find();
            res.status(200).json(companies);
            
        } catch (error) {
             res.status(500).json({ message: error.message });
        }
    },
    getCompanyById : async (req ,res) =>{
        try {
            const company = await CompanyProfile.findById(req.params.id);
            res.status(200).json(company);
            
        } catch (error) {
             res.status(500).json({ message: error.message });
        }
    },
    updateCompany : async (req ,res) =>{
        try {
            const company = await CompanyProfile.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
            if(!company){
                return res.status(404).json({message:'Company not found'});
            }
            res.status(200).json(company);
            
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    deleteCompany : async (req ,res) =>{
        try {
            const company = await CompanyProfile.findByIdAndDelete(req.params.id);
            if(!company){
                return res.status(404).json({message:'Company not found'});
            }
            res.status(200).json({message:'Company deleted successfully'});
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
}

module.exports = companyController;