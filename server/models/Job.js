const mongoose = require('mongoose');

const jobSchema =  new mongoose.Schema({
    placementDrive:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PlacementDrive',
        required:true
    },
    title:{
        type:String,
        required:[true,'Job title is required'],
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    location:{
        type:String,
        trim:true
    },
    salary:{
        type:String,
        trim:true
    },
    skillsRequired:{
        type:[String],
        default:[]
    },
    openings:{
        type:Number,
        default:1,
        min:[1,'Openings must be greater than 0']

    },
    postedDate:{
        type:Date,
        default:Date.now
    },
    applicationDeadline:{
        type:Date,
        validate:{
            validator:function(value){
                return value > this.postedDate;
            },
            message:'Application deadline must be after the posting date'
        }
    },


    },{
        timestamps:true,
    }
);

module.exports = mongoose.model('Job',jobSchema,'Jobs');