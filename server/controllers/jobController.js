const Job = require("../models/Job");

const jobController = {
    createJob: async (req, res)=>{
        try {
       const job = await Job.create(req.body);
       res.status(201).json({success:true,data:job,message:"Job created successfully"});
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }},
    getAllJobs: async (req, res)=>{try {
        const jobs = await Job.find().populate('company','name industry');
        res.status(200).json({success:true,count:jobs.length,data:jobs});
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }},
    getSingleJob: async (req, res)=>{try {
        
        const job = await Job.findById(req.params.id).populate('company','name industry');
        if(!job){
            return res.status(404).json({success:false,message:'Job not found'});
        }
        res.status(200).json({success:true,data:job});
    } catch (error) {
        res.status(500).json({success:false,message:error.message });
    }},
    updateJob: async (req, res)=>{try {
       const job = await Job.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
       if(!job){
           return res.status(404).json({success:false,message:'Job not found'});
       }
       res.status(200).json({success:true,data:job,message:"Job updated successfully"});
    } catch (error) {
        res.status(500).json({ success:false,message: error.message });
    }},
    deleteJob: async (req, res)=>{try {
       const job = await Job.findByIdAndDelete(req.params.id);
       if(!job){
        return res.status(404).json({success:false,message:'job not found'})
       }
       res.status(200).json({success:true,data:job,message:"Job deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
}

module.exports = jobController;