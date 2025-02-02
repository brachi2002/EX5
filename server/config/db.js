const mongoose = require('mongoose'); // ייבוא Mongoose לניהול מסד הנתונים MongoDB

// =====================
// פונקציה שמתחברת למסד הנתונים
// =====================
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { // שימוש במשתנה סביבה לכתובת החיבור (URI)
            useNewUrlParser: true, // הגדרת שימוש בפרסר החדש של Mongoose
            useUnifiedTopology: true // מניעת חיבורים ישנים והבטחת שימוש במנהל חיבורים חדש
        });

        console.log('MongoDB connected successfully'); // הדפסת הודעה אם החיבור הצליח
    } catch (error) {
        console.error('Error connecting to MongoDB:', error); // הדפסת שגיאה אם החיבור נכשל
        process.exit(1); // יציאה מתהליך השרת עם קוד שגיאה (1) כדי למנוע עבודה עם חיבור כושל
    }
};

// =====================
// ייצוא הפונקציה לשימוש בקובץ השרת הראשי
// =====================
module.exports = connectDB;
