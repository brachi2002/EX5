require('dotenv').config(); // טוען משתני סביבה מקובץ .env
const express = require('express'); // ייבוא Express.js
const connectDB = require('./config/db'); // ייבוא פונקציית החיבור למסד הנתונים
const cors = require('cors'); // מאפשר תקשורת בין דומיינים שונים (Cross-Origin Resource Sharing)
const path = require('path'); // מודול מובנה ב-Node.js לעבודה עם נתיבי קבצים

const app = express(); // יצירת אפליקציה חדשה של Express

// =====================
// התחברות למסד הנתונים
// =====================
connectDB(); // קריאה לפונקציה שמתחברת למסד הנתונים (MongoDB )

// =====================
// Middleware (שכבות ביניים)
// =====================
app.use(cors()); // מתיר קריאות API ממקורות חיצוניים
app.use(express.json()); // מאפשר עבודה עם בקשות בפורמט JSON

// =====================
// ניתובים (Routes)
// =====================
app.use('/api/projects', require('./routes/projectRoutes')); // נתיב לניהול פרויקטים
app.use('/api/members', require('./routes/memberRoutes')); // נתיב לניהול חברי צוות

// =====================
// שרת קבצים סטטיים (Frontend)
// =====================
app.use(express.static(path.join(__dirname, '../client'))); // משרת קבצים סטטיים מתיקיית ה-Client

// =====================
// דף הבית - ברירת מחדל
// =====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html')); // שולח את דף ה-HTML הראשי של האפליקציה
});

// =====================
// הפעלת השרת
// =====================
const PORT = process.env.PORT || 3001; // קביעת הפורט, עם ברירת מחדל ל-3001 אם לא הוגדר בפונקציות הסביבה
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // הדפסת הודעה בקונסול כשהשרת פועל
});
