const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Member = require('../models/Member');


// יצירת פרויקט חדש
router.post('/create', async (req, res) => {
    try {
        const { name, description, startDate, manager, team } = req.body;

        // בדיקה אם רשימת הצוות ריקה
        if (!team || team.length === 0) {
            return res.status(400).json({ error: "A project must have at least one team member" });
        }

        const newProject = new Project({
            name,
            description,
            startDate,
            manager,
            team
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// שליפת צוות הפרויקט
router.get('/:id/team', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(project.team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post('/:id/addMember', async (req, res) => {
    try {
        const { memberId, role } = req.body;

        // חיפוש חבר הצוות
        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ message: "Member not found" });

        // חיפוש הפרויקט
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


// שליפת כל הפרויקטים
router.get('/list', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// שליפת פרויקט לפי מזהה
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// מחיקת פרויקט לפי מזהה
router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
