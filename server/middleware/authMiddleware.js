const jwt = require('jsonwebtoken');

const {JWT_SECRET} = require('../utils/config');

const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token || req.headers('Authorization')?.replace('Bearer','');
    if(!token){
        return res.status(401).json({message:'No token , authorization denied'});
    } 
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({message:'Token is not valid'});
    }
}

module.exports = authMiddleware;