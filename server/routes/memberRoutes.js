const express = require('express');
const router = express.Router();
const Member = require('../models/Member'); // טעינת המודל של חברי הצוות

// =====================
// נתיב לקבלת רשימת חברי צוות
// =====================
router.get('/list', async (req, res) => {
    try {
                // שליפת רשימת כל חברי הצוות מהמסד נתונים, אך מחזיר רק את השדות 'name' ו-'email'

        const members = await Member.find({}, { name: 1, email: 1 }); // מחזיר רק שם ואימייל
        res.status(200).json(members);// מחזיר את הנתונים בפורמט JSON
    } catch (error) {
        res.status(500).json({ error: error.message });// במקרה של שגיאה, מחזיר שגיאה למשתמש
    }
});


// =====================
// נתיב ליצירת חבר צוות חדש
// =====================
router.post('/create', async (req, res) => {
    try {
        const { name, email } = req.body; // מקבל את השם והמייל מהבקשה
        // בדיקה האם הנתונים נשלחו

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });// החזרת שגיאה אם אחד השדות חסר
        }
        // יצירת אובייקט חדש של חבר צוות ושמירה במסד הנתונים

        const newMember = new Member({ name, email });
        await newMember.save();// שמירת הנתון במסד

        res.status(201).json({ memberId: newMember._id });// מחזיר מזהה של חבר הצוות שנוצר
    } catch (error) {
        res.status(500).json({ error: error.message }); // במקרה של שגיאה, מחזיר שגיאה למשתמש
    }
});

module.exports = router;// ייצוא הנתיב כדי שנוכל להשתמש בו בקובץ הראשי של השרת
