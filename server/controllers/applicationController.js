const applicationController = {
    createApplication:async (req,res)=>{try {
        res.send('create application')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    getAllApplications:async (req,res)=>{try {
        res.send('get all applications')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    getSingleApplication:async (req,res)=>{try {
        res.send(`Get application with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    updateApplication:async (req,res)=>{try {
        res.send(`Update application with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    deleteApplication:async (req,res)=>{try {
        res.send(`Delete application with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
}

module.exports = applicationController