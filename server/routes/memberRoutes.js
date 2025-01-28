const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// יצירת חבר צוות חדש
router.post('/create', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const newMember = new Member({ name, email });
        await newMember.save();

        res.status(201).json({ memberId: newMember._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// שליפת כל חברי הצוות
router.get('/list', async (req, res) => {
    try {
        const members = await Member.find({}, { name: 1, email: 1 }); // מחזירים רק שם ואימייל
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
