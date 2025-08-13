const errorRoute =(req,res)=>{
    return res.status(404).json({error:'Route not found '});
}

module.exports = errorRoute;