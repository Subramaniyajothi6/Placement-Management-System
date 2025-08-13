const authController = {
    register: (req, res) => {
        try {
            res.send('register')
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: (req, res) => {
        try {
            res.send('login')
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    logout: (req, res) => {
        try {
            res.send('logout')
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    profile: (req, res) => {
        try {
            res.send('profile')
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

}

module.exports = authController;