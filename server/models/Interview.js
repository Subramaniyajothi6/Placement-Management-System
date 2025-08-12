const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required']

    },
    endTime: {
        type: Date,
        validate: {
            validator: function (value) {
                return !value || value > this.startTime;
            },
            message: 'End time must be after start time'
        }
    },
    durationMinutes: {
        type: Number,
        default: 30
    },
    timezone: {
        type: String,
        default: 'UTC'
    },
    round: {
        type: String,
        default: 'Round 1',
    },
    interviewDate: {
        type: Date,
        required: [true, 'Interview date is required']
    },
    interviewType: {
        type: String,
        enum: ['Online', 'Offline', 'Hybrid'],
        default: 'Online'
    },
    platform: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    meetingId: {
        type: String,
        trim: true
    },
    meetingPassword: {
        type: String,
        trim: true,
        select: false
    },
    interviewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    feedback: {
        type: String,
        trim: true
    },
    score: {
        type: Number,
        min: 0,
        max: 100
    },
    result: {
        type: String,
        enum: ['Pending', 'Shortlisted', 'Rejected', 'Selected'],
        default: 'Pending'
    },
    attachments: [
        {
            url: String,
            name: String,
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId, ref: 'User'
            },
            uploadedAt:{type:Date,default:Date.now}
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancelReason: { type: String, trim: true },

    reminder: [
        {
            whenMinutesBefore: Number,
            sentAt: Date
        }

    ],
    videoProvider: {
        providerName: String,
        externalMeetingId: String,
        webhookStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'cancelled'],
            default: 'pending'
        }
    }

}, { timestamps: true });

InterviewSchema.index({ candidate: 1, startTime: 1 });
InterviewSchema.index({ job: 1, startTime: 1 });
InterviewSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model('Interview', InterviewSchema, 'Interviews');