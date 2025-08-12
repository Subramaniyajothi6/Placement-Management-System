const mongoose =  require('mongoose');

const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

const StudentProfileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    bio:{
        type:String,        
        trim:true,
        maxlength:[500,'Bio must be less than 500 characters long']
    },
    education:[

        {
            institution:String,
            degree:String,
            fieldOfStudy:String,
            startYear:Number,
            endYear:Number
        }

    ],
    experience:[
        {
            company:String,
            role:String,
            startDate:Date,
            endDate:Date,
            description:String
        }
    ],
    skills:[
        {
            type:String,
            trim:true,

        }
    ],
    portfolioLinks:[{
        type:String,
        trim:true,
        match: [urlRegex, 'Please enter a valid URL']

    }],
    resume:{
        type:String,
        trim:true,
        match: [urlRegex, 'Please enter a valid URL of resume']

    }
},{timestamps:true});

module.exports = mongoose.model('StudentProfile',StudentProfileSchema,'StudentProfile');