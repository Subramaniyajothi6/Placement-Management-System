const mongoose = require('mongoose');


const companyProfileSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    industry: { type: String, trim: true },
    size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
        default: '1-10'
    },

    description: {
        type: String,
        trim: true
    },
    logo: {
        type: String,
        trim: true,

    },
    website: {
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, 'Please enter a valid URL']
    },
    location: {
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        pincode: { type: String, trim: true },
    },
    contactPerson: {
        name: { type: String, trim: true },
        email: { type: String, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] },
        phone: { type: String, trim: true },
    },
    socialLinks: {
        linkedin: String,
        twitter: String,
        facebook: String
    },
    verified: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },


}, {
    timestamps: true
})

module.exports = mongoose.model('CompanyProfile', companyProfileSchema, 'CompanyProfiles');