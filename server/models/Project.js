const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Project description is required"],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"]
    },
    manager: {
        name: {
            type: String,
            required: [true, "Manager name is required"]
        },
        email: {
            type: String,
            required: [true, "Manager email is required"],
            match: [/.+\@.+\..+/, "Please enter a valid email"]
        }
    },
    team: [
        {
            memberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Member"
            },
            name: {
                type: String,
                required: [true, "Member name is required"]
            },
            email: {
                type: String,
                required: [true, "Member email is required"],
                match: [/.+\@.+\..+/, "Please enter a valid email"]
            },
            role: {
                type: String,
                required: [true, "Role is required"]
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
