const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { JWT_SECRET } = require('../utils/config');
const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists' })
            }
            const newUser = new User(
                {
                    name,
                    email,
                    password,
                    role
                }
            )
            await newUser.save();
            const { password: _, ...userData } = newUser.toObject();
            const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });

            res.status(201).json({ success: true, message: `User created successfully`, user: userData, token });
        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' })
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Invalid credentials' })
            }

            const tokenPayload = {
                id: user._id,
                role: user.role,
                companyId: user.role === 'company' ? user.companyId : null,
            };
            const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
            const { password: _, ...userData } = user.toObject();

            res.status(200).json({ success: true, message: 'Login successful', user: userData, token })

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },


    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password');
            res.status(200).json({ success: true, count: users.length, data: users });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getUserId: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select('-password');
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
        
    },
    logout: async (req, res) => {
        try {
            res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
            res.status(200).json({ success: true, message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    profile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateRole: async (req, res) => {
        try {
            const { role } = req.body; // new role
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { role },
                { new: true, runValidators: true }
            ).select('-password');

            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = authController;