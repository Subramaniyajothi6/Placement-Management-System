const express = require('express');
const { register, login, logout, profile } = require('../controllers/authController');


const authRouter = express.Router();


// authRouter.post('/register', authController.register);
// authRouter.post('/login', authController.login);

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/profile',profile)
module.exports = authRouter;