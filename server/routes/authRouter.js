const express = require('express');
const { register, login, logout, profile, updateRole } = require('../controllers/authController');
const {authMiddleware, adminMiddleware} = require('../middleware/authMiddleware');


const authRouter = express.Router();


// authRouter.post('/register', authController.register);
// authRouter.post('/login', authController.login);

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/profile',authMiddleware,profile);
authRouter.put('/profile/role/:id',authMiddleware,updateRole)
module.exports = authRouter;