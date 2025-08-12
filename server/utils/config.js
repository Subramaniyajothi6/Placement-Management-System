require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;



module.exports = {
    MONGODB_URI,
    PORT,
    JWT_SECRET

}