const mongoose = require('mongoose'); // ייבוא Mongoose לניהול המסד נתונים

// =====================
// הגדרת סכמת חברי צוות
// =====================
const MemberSchema = new mongoose.Schema({
    // שם החבר בצוות
    name: {
        type: String, // סוג הנתון - מחרוזת
        required: [true, "Member name is required"], // חובה למלא שם
        trim: true // מסיר רווחים מיותרים בהתחלה ובסוף
    },

    // אימייל של חבר הצוות
    email: {
        type: String, // סוג הנתון - מחרוזת
        required: [true, "Email is required"], // חובה למלא אימייל
        unique: true, // אימייל חייב להיות ייחודי במסד הנתונים
        match: [/.+\@.+\..+/, "Please enter a valid email"] // אימות פורמט של אימייל
    },

    // רשימת הפרויקטים שבהם חבר הצוות משתתף
    projects: [
        {
            projectId: {
                type: mongoose.Schema.Types.ObjectId, // מזהה ייחודי של הפרויקט
                ref: "Project" // מצביע על מודל "Project" כדי לאפשר שיוך בין חברים לפרויקטים
            },
            projectName: String, // שם הפרויקט
            role: {
                type: String, // תפקיד של חבר הצוות בפרויקט
                required: [true, "Role in project is required"] // חובה להזין תפקיד בפרויקט
            }
        }
    ]
}, { timestamps: true }); // הוספת שדות של createdAt ו-updatedAt אוטומטית

// =====================
// ייצוא המודל לשימוש בקובצי השרת
// =====================
module.exports = mongoose.model('Member', MemberSchema);
