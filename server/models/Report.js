const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({

    placementDrive:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'placementDrive',
        required:true,
        unique:true // only one report per placement drive
    },
    participantCount:{
        type:Number,
        default:0
    },
    interviewCount:{
        type:Number,
        default:0   
    },
    offersMade:{
        type:Number,
        default:0
    },
    studentsPlaced:{
        type:Number,
        default:0
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true,
        validate:function(value){
            return value >= this.startDate;
        },
        message :'End date must be greater than start date'
    },
    summary:{
        type:String,
        trim:true
    },

},{
    timestamps:true
})


module.exports = mongoose.model('Report',ReportSchema,'Reports');
