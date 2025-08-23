const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minLength: [2, 'Name must be atleast 2 characters long'] },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] },
    password: { type: String, required: true, minLength: [6, 'Password must be at least 6 characters long'] },
    role: { type: String, enum: ['student', 'company', 'admin'], default: 'student' },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyProfile',
        required: function () { return this.role === 'company'; }
    },
    resetToken: String,
    resetTokenExpiration: Date,
    isActive: {
        type: Boolean,
        default: true,
    },
},
    { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('User', userSchema, 'User');