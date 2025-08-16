const Application = require("../models/Application");
const applicationController = {

    //  create new application
    createApplication:async (req,res)=>{try {
        
        const application = await Application.create(req.body);
        res.status(201).json({success:true,message:"Application created successfully",data:application});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }},

    // get all applications
    getAllApplications:async (req,res)=>{try {
       const applications = await Application.find();
       res.status(200).json({success:true,count:applications.length,data:applications})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},

    // get single application
    getSingleApplication:async (req,res)=>{try {
        const application = await Application.findById(req.params.id);
        if(!application){
            return res.status(404).json({success:false,message:"Application not found"})
        }
        res.status(200).json({success:true,data:application})
        // res.send(`Get application with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},

    // update application
    updateApplication:async (req,res)=>{try {
        // res.send(`Update application with ID: ${req.params.id}`)
        const application = await Application.findByIdAndUpdate(req.params.id,
            req.body,
            {new:true,runValidators:true}
        );
        if(!application){
            return res.status(404).json({success:false,message:'Application not found'})
        }
        res.status(200).json({success:true,message:"Application updated successfully",data:application});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    // delete application
    deleteApplication:async (req,res)=>{try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if(!application){
            return res.status(404).json({success:false,message:'Application not found'})
        }

        res.status(200).json({success:true,message:"Application deleted successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
}

module.exports = applicationController