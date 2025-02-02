const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

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
            return res.status(400).json({ error: "Member is already assigned to this project" });
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


module.exports = router;
