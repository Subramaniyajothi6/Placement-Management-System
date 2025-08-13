const jobController = {
    createJob: async (req, res)=>{try {
        res.send('create job')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    getAllJobs: async (req, res)=>{try {
        res.send('get all jobs')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    getSingleJob: async (req, res)=>{try {
        res.send(`Get job with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    updateJob: async (req, res)=>{try {
        res.send(`Update job with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    deleteJob: async (req, res)=>{try {
        res.send(`Delete job with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
}

module.exports = jobController;