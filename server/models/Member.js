const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Member name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email"]
    },
    projects: [
        {
            projectId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project"
            },
            projectName: String,
            role: {
                type: String,
                required: [true, "Role in project is required"]
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);
