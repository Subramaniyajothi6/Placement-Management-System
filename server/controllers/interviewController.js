const interviewController = {
    createInterview:(req,res)=>{try {
        res.send('create interview')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    getAllInterviews:(req,res)=>{try {
        res.send('get all interviews')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    getSingleInterview:(req,res)=>{try {
        res.send(`Get interview with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    updateInterview:(req,res)=>{try {
        res.send(`Update interview with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }},
    deleteInterview:(req,res)=>{try {
        res.send(`Delete interview with ID: ${req.params.id}`)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}

};

module.exports = interviewController;
