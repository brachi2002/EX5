require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');


const app = express();

// התחברות למסד הנתונים
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// ניתובים
app.use('/api/projects', require('./routes/projectRoutes'));

// app.get('/', (req, res) => {
//     res.send('Welcome to the Project Management API');
// });
app.use('/api/members', require('./routes/memberRoutes'));

// שרת קבצים סטטיים
app.use(express.static(path.join(__dirname, '../client')));

// נתיב ברירת מחדל
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
