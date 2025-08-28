const jwt = require('jsonwebtoken');

const {JWT_SECRET} = require('../utils/config');
const { body, validationResult } = require('express-validator');

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



const jobCreateValidationRules = [
  body('placementDrive')
    .notEmpty().withMessage('Placement Drive is required')
    .isMongoId().withMessage('Placement Drive must be a valid ID'),
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').optional().isString(),
  body('location').optional().isString(),
  body('salary').optional().isString(),
  body('skillsRequired').optional().isArray(),
  body('skillsRequired.*').optional().isString(),
  body('openings').optional().isInt({ min: 1 }).withMessage('Openings must be at least 1'),
  body('applicationDeadline')
    .optional()
    .isISO8601().withMessage('Application Deadline must be a valid date')
    .custom((value, { req }) => {
      const postedDate = req.body.postedDate ? new Date(req.body.postedDate) : new Date();
      const deadline = new Date(value);
      if (deadline <= postedDate) {
        throw new Error('Application deadline must be after the posting date');
      }
      return true;
    }),
];


// Middleware to check validation result
const validateJob = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return res.status(400).json({ success: false, message: messages });
  }
  next();
};
module.exports = {authMiddleware,adminMiddleware,roleMiddleware, jobCreateValidationRules, validateJob};