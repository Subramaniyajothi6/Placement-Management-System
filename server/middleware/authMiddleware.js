const jwt = require('jsonwebtoken');

const {JWT_SECRET} = require('../utils/config');

const authMiddleware = (req, res, next) => {
  let token = null;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers?.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};


const adminMiddleware = (req,res,next)=>{
    if(req.user.role !=='admin'){
        return res.status(403).json({message:'Access denied: Admin role required'});
    }
    next();
}

const roleMiddleware = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = {authMiddleware,adminMiddleware,roleMiddleware};