const CompanyProfile = require("../models/CompanyProfile");

const companyController = {

    createCompany : async (req ,res) =>{
        try {
            const company = await CompanyProfile.create(req.body);
            
            res.status(201).json({
                success:true,
                message:'Company Created Successfully',
                data:company,
            })
        } catch (error) {
            res.status(500).json({success:false,message:error.message});
        }
    },
    getAllCompanies : async (req ,res) =>{
        try {
            const companies = await CompanyProfile.find();
            res.status(200).json({
                success:true,
                count:companies.length,
                data:companies
            });
            
        } catch (error) {
             res.status(500).json({ message: error.message });
        }
    },
    getCompanyById : async (req ,res) =>{
        try {
            const company = await CompanyProfile.findById(req.params.id);
            if(!company){
                return res.status(404).json({success:false,message:'Company not found'})
            }
            res.status(200).json(
                {success:true,
                message:'Company Fetched Successfully',
                data:company});
            
        } catch (error) {
             res.status(500).json({ message: error.message });
        }
    },
    updateCompany : async (req ,res) =>{
        try {
            const company = await CompanyProfile.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
            if(!company){
                return res.status(404).json({success:false,message:'Company not found'});
            }
            res.status(200).json({
                success:true,
                message:'Company Updated Successfully',
                data:company
            });
            
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    deleteCompany : async (req ,res) =>{
        try {
            const company = await CompanyProfile.findByIdAndDelete(req.params.id);
            if(!company){
                return res.status(404).json({success:false,message:'Company not found'});
            }
            res.status(200).json({success:true,message:'Company deleted successfully'});
            
        } catch (error) {
            res.status(500).json({success:false, message: error.message });
        }
    },
    
}

module.exports = companyController;