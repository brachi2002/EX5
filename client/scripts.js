$(document).ready(function () {
    /** ---------------------- פונקציות כלליות ---------------------- **/
    function openModal(modalId) {
        $("#" + modalId).fadeIn();
    }

    function closeModal(modalId) {
        $("#" + modalId).fadeOut();
    }

    /** ---------------------- ניהול חברי צוות ---------------------- **/
    function loadMembers() {
        $.ajax({
            url: "http://localhost:3001/api/members/list",
            type: "GET",
            success: function (members) {
                $(".memberSelect").empty();
                members.forEach(member => {
                    $(".memberSelect").append(`<option value="${member._id}">${member.name} (${member.email})</option>`);
                });
            },
            error: function (err) {
                alert("Error loading members");
                console.log(err);
            }
        });
    }

    $("#showAddMemberModal").click(function () {
        openModal("addMemberModal");
    });

    $("#addMemberForm").submit(function (event) {
        event.preventDefault();
        const newMember = {
            name: $("#memberName").val(),
            email: $("#memberEmail").val()
        };

        $.ajax({
            url: "http://localhost:3001/api/members/create",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(newMember),
            success: function () {
                alert("Member added successfully!");
                $("#addMemberForm")[0].reset();
                closeModal("addMemberModal");
                loadMembers();
            },
            error: function (err) {
                alert("Error adding member");
                console.log(err);
            }
        });
    });

    /** ---------------------- ניהול פרויקטים ---------------------- **/
    $("#showAddProjectModal").click(function () {
        $("#teamMembers").empty();
        loadMembers();
        openModal("addProjectModal");
    });

    $("#addTeamMember").click(function () {
        $("#teamMembers").append(`
            <div class="teamMember">
                <select class="memberSelect"></select>
                <input type="text" class="memberRole" placeholder="Role in project" required>
                <button type="button" class="removeMember">Remove</button>
            </div>
        `);
        loadMembers();
    });

    $(document).on("click", ".removeMember", function () {
        $(this).closest(".teamMember").remove();
    });

    $("#addProjectForm").submit(function (event) {
        event.preventDefault();

        const newProject = {
            name: $("#projectName").val(),
            description: $("#projectDesc").val(),
            startDate: $("#startDate").val(),
            manager: {
                name: $("#managerName").val(),
                email: $("#managerEmail").val()
            },
            team: []
        };

        $(".teamMember").each(function () {
            const memberId = $(this).find(".memberSelect").val();
            const role = $(this).find(".memberRole").val();
            if (memberId && role) {
                newProject.team.push({ memberId, role });
            }
        });

        if (newProject.team.length === 0) {
            alert("You must add at least one team member!");
            return;
        }

        $.ajax({
            url: "http://localhost:3001/api/projects/create",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(newProject),
            success: function () {
                alert("Project added successfully!");
                $("#addProjectForm")[0].reset();
                closeModal("addProjectModal");
                $("#loadProjects").click();
            },
            error: function (err) {
                alert("Error adding project");
                console.log(err);
            }
        });
    });

    $("#loadProjects").click(function () {
        $.ajax({
            url: "http://localhost:3001/api/projects/list",
            type: "GET",
            success: function (projects) {
                $("#projectList").empty();
                projects.forEach(project => {
                    const teamList = project.team.length > 0 
                        ? project.team.map(member => `${member.name} (${member.role})`).join(", ") 
                        : "No team members";
                    const formattedDate = new Date(project.startDate).toLocaleString();

                    $("#projectList").append(`
                        <tr>
                            <td>${project.name}</td>
                            <td>${project.manager.name} (${project.manager.email})</td>
                            <td>${formattedDate}</td>
                            <td>${teamList}</td>
                            <td>
                                <button onclick="viewTeam('${project._id}')">View Team</button>
                                <button onclick="deleteProject('${project._id}')">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function (err) {
                alert("Error loading projects");
                console.log(err);
            }
        });
    });

    /** ---------------------- פונקציות נוספות ---------------------- **/
    function viewTeam(projectId) {
        $.ajax({
            url: `http://localhost:3001/api/projects/${projectId}/team`,
            type: "GET",
            success: function (team) {
                const teamList = team.map(member => `${member.name} (${member.email}) - ${member.role}`).join("\n");
                alert(`Team Members:\n${teamList}`);
            },
            error: function (err) {
                alert("Error loading team members");
                console.log(err);
            }
        });
    }

    function deleteProject(projectId) {
        if (!confirm("Are you sure you want to delete this project?")) return;

        $.ajax({
            url: `http://localhost:3001/api/projects/${projectId}`,
            type: "DELETE",
            success: function () {
                alert("Project deleted successfully!");
                $("#loadProjects").click();
            },
            error: function (err) {
                alert("Error deleting project");
                console.log(err);
            }
        });
    }
});
