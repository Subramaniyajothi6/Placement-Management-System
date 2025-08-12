const mongoose = require('mongoose');


const PlacementDriveSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Title is required'],
        trim:true
    },
    companyName:{
        type:String,
        required:[true,'Company name is required'],
        trim:true
    },
    location:{
        type:String,
        trim:true,
    },
    startDate:{
        type:Date,
        required:[true,'Start date is required']
    },
    endDate:{
        type:Date,
        required:true,
        validate:{
            validator:function(value){
                return value > this.startDate;
            },
            message:'End date must be greater than start date'
        }
    },
    eligibilityCriteria:{
        type:String,
        trim:true
    },
    jobDescription:{
        type:String,
        trim:true
    },
    packageOffered:{
        type:String,
        trim:true
    },
    contactPerson:{
        name:String,
        email:{
            type:String,
            match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
            trim:true
        },
        phone:String  
    },

},
{
    timestamps:true
})

module.exports = mongoose.model('PlacementDrive',PlacementDriveSchema,'PlacementDrives');