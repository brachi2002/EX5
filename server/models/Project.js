const mongoose = require('mongoose'); // ייבוא Mongoose לניהול מסד הנתונים

// =====================
// הגדרת סכמת פרויקטים
// =====================
const ProjectSchema = new mongoose.Schema({
    // שם הפרויקט
    name: {
        type: String, // סוג הנתון - מחרוזת
        required: [true, "Project name is required"], // חובה להזין שם לפרויקט
        trim: true // מסיר רווחים מיותרים בתחילת ובסוף הטקסט
    },

    // תיאור הפרויקט
    description: {
        type: String, // סוג הנתון - מחרוזת
        required: [true, "Project description is required"], // חובה להזין תיאור לפרויקט
        trim: true // מסיר רווחים מיותרים
    },

    // תאריך התחלה של הפרויקט
    startDate: {
        type: Date, // סוג הנתון - תאריך
        required: [true, "Start date is required"] // חובה להזין תאריך התחלה
    },

    // פרטי המנהל של הפרויקט
    manager: {
        name: {
            type: String, // שם המנהל
            required: [true, "Manager name is required"] // חובה להזין שם מנהל
        },
        email: {
            type: String, // אימייל המנהל
            required: [true, "Manager email is required"], // חובה להזין אימייל
            match: [/.+\@.+\..+/, "Please enter a valid email"] // אימות כתובת אימייל
        }
    },

    // צוות הפרויקט - מערך של חברי צוות
    team: [
        {
            memberId: {
                type: mongoose.Schema.Types.ObjectId, // מזהה ייחודי של חבר הצוות
                ref: "Member" // קישור למודל "Member"
            },
            name: {
                type: String, // שם חבר הצוות
                required: [true, "Member name is required"] // חובה להזין שם
            },
            email: {
                type: String, // אימייל חבר הצוות
                required: [true, "Member email is required"], // חובה להזין אימייל
                match: [/.+\@.+\..+/, "Please enter a valid email"] // אימות כתובת אימייל
            },
            role: {
                type: String, // תפקיד של חבר הצוות בפרויקט
                required: [true, "Role is required"] // חובה להזין תפקיד
            }
        }
    ]
}, { timestamps: true }); // הוספת שדות createdAt ו-updatedAt אוטומטית

// =====================
// ייצוא המודל לשימוש בקובצי השרת
// =====================
module.exports = mongoose.model('Project', ProjectSchema);
