const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // טעינת המודל של פרויקטים
const Member = require('../models/Member'); // טעינת המודל של חברי צוות

// =====================
// יצירת פרויקט חדש
// =====================
router.post('/create', async (req, res) => {
    try {
        const { name, description, startDate, manager, team } = req.body;

        // בדיקה אם יש לפחות חבר צוות אחד בפרויקט
        if (!team || team.length === 0) {
            return res.status(400).json({ error: "A project must have at least one team member" });
        }

        // יצירת פרויקט חדש עם הנתונים שנשלחו בבקשה
        const newProject = new Project({
            name,
            description,
            startDate,
            manager,
            team
        });

        // שמירת הפרויקט במסד הנתונים
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ error: error.message }); // טיפול בשגיאות
    }
});

// =====================
// שליפת צוות הפרויקט לפי מזהה הפרויקט
// =====================
router.get('/:id/team', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        res.status(200).json(project.team); // מחזיר את רשימת הצוות של הפרויקט
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================
// הוספת חבר צוות לפרויקט
// =====================
router.post('/:id/addMember', async (req, res) => {
    try {
        const { memberId, role } = req.body;

        // חיפוש חבר הצוות במסד הנתונים
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ message: "Member not found" });

        // חיפוש הפרויקט במסד הנתונים
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // בדיקה אם חבר הצוות כבר משויך לפרויקט
        const isMemberInProject = project.team.some(teamMember => teamMember.memberId.equals(memberId));
        if (isMemberInProject) {
            return res.status(400).json({ error: "Member is already in the project" });
        }

        // הוספת חבר הצוות לפרויקט
        project.team.push({
            memberId: member._id,
            name: member.name,
            email: member.email,
            role
        });
        await project.save();

        // הוספת הפרויקט לרשימת הפרויקטים של חבר הצוות
        member.projects.push({
            projectId: project._id,
            projectName: project.name,
            role
        });
        await member.save();

        res.status(200).json({ message: "Member added successfully to the project" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================
// שליפת רשימת כל הפרויקטים
// =====================
router.get('/list', async (req, res) => {
    try {
        const projects = await Project.find().sort({ startDate: -1 }); // מיון הפרויקטים מהחדש לישן
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================
// שליפת פרויקט ספציפי לפי מזהה
// =====================
router.get('/:id', async (req, res) => {
    try {
        // חיפוש הפרויקט ושיוך חברי הצוות כולל שם ואימייל
        const project = await Project.findById(req.params.id).populate('team.memberId', 'name email');
        if (!project) return res.status(404).json({ message: "Project not found" });

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================
// מחיקת פרויקט
// =====================
router.delete('/:id', async (req, res) => {
    try {
        const projectId = req.params.id;

        // מוצאים את הפרויקט כדי לקבל את רשימת אנשי הצוות
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // מסירים את הפרויקט מכל חברי הצוות שרשומים אליו
        await Member.updateMany(
            { "projects.projectId": projectId }, 
            { $pull: { projects: { projectId: projectId } } }
        );

        // מוחקים את הפרויקט עצמו מהמסד נתונים
        await Project.findByIdAndDelete(projectId);

        res.status(200).json({ message: "Project deleted successfully and removed from team members" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; // ייצוא הנתיב לשימוש בקובץ הראשי של השרת
