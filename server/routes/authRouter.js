const express = require('express');
const { register, login, logout, profile, updateRole, getAllUsers } = require('../controllers/authController');
const {authMiddleware, adminMiddleware} = require('../middleware/authMiddleware');


const authRouter = express.Router();


authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/profile',authMiddleware,profile);
authRouter.put('/profile/role/:id',authMiddleware,updateRole)
authRouter.get('/users', authMiddleware, getAllUsers);
module.exports = authRouter;