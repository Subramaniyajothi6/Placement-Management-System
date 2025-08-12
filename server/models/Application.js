const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CompanyProfile',
        required:true
    },
    resume:{
        type:String,
        required:[true,'Resume is required']
    },
    coverletter:{
        type:String,
        trim:true
    },
    status:{
        type:String,
        enum:['Submitted','Under Review','Shortlisted','Rejected','Hired'],
        default:'Submitted'
    },
     appliedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes:{
        type:String,
        trim:true
    }

},{
    timestamps:true
})

module.exports = mongoose.model('Application',ApplicationSchema,'Applications')