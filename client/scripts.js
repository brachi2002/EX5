$(document).ready(function () {
    /** ---------------------- פונקציות כלליות ---------------------- **/

    function openModal(modalId) {
        $("#" + modalId).fadeIn();
    }

    function closeModal(modalId) {
        $("#" + modalId).fadeOut();
    }
        /** ---------------------- טעינת הפרויקטים אוטומטית ---------------------- **/
        function loadProjects() {
            $.ajax({
                url: "http://localhost:3001/api/projects/list",
                type: "GET",
                success: function (projects) {
                    $("#projectList").empty();
                    projects.forEach(project => {
                        const teamList = project.team.length > 0 
                            ? project.team.map(member => `${member.name} (${member.role})`).join(", ") 
                            : "No team members";
                            const formattedDate = new Intl.DateTimeFormat('en-GB', { 
                                year: 'numeric', 
                                month: '2-digit', 
                                day: '2-digit', 
                                hour: '2-digit', 
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                            }).format(new Date(project.startDate));                            
                        $("#projectList").append(`
                            <tr>
                                <td>${project._id}</td>
                                <td>${project.name}</td>
                                <td><a href="mailto:${project.manager.email}" class="email-link">${project.manager.name} (${project.manager.email})</a></td>
                                <td>${formattedDate}</td>
                                <td>${teamList}</td>
                                <td>
                                    <button class="viewTeam" data-id="${project._id}">View Team</button>
                                    <button class="deleteProject" data-id="${project._id}">Delete</button>
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
        }
    
        // קריאה לפונקציה עם טעינת הדף
        loadProjects();
    
        // טיפול במחיקה של פרויקט
        $(document).on("click", ".deleteProject", function () {
            const projectId = $(this).data("id");
    
            if (!confirm("Are you sure you want to delete this project?")) return;
    
            $.ajax({
                url: `http://localhost:3001/api/projects/${projectId}`,
                type: "DELETE",
                success: function () {
                    alert("Project deleted successfully!");
                    loadProjects(); // רענון הרשימה אחרי מחיקה
                },
                error: function (err) {
                    alert("Error deleting project");
                    console.log(err);
                }
            });
        });
    
    
    
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

    $(document).on("click", "#showAddMemberModal", function () {
        openModal("addMemberModal");
    });

    // $("#addMemberForm").submit(function (event) {
    //     event.preventDefault();
    //     const newMember = {
    //         name: $("#memberName").val(),
    //         email: $("#memberEmail").val()
    //     };

    //     $.ajax({
    //         url: "http://localhost:3001/api/members/create",
    //         type: "POST",
    //         contentType: "application/json",
    //         data: JSON.stringify(newMember),
    //         success: function () {
    //             alert("Member added successfully!");
    //             $("#addMemberForm")[0].reset();
    //             closeModal("addMemberModal");
    //             loadMembers();
    //         },
    //         error: function (err) {
    //             alert("Error adding member");
    //             console.log(err);
    //         }
    //     });
    // });

    $("#addMemberForm").submit(function (event) {
        event.preventDefault();
        const memberId = $("#memberIdInput").val();  // מזהה מוקלד
        const role = $("#memberRole").val();
    
        if (!memberId || !role) {
            alert("Member ID and role are required!");
            return;
        }
    
        $.ajax({
            url: `http://localhost:3001/api/projects/${selectedProjectId}/addMember`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ memberId, role }),
            success: function () {
                alert("Member added successfully!");
                closeModal("addMemberModal");
            },
            error: function (err) {
                alert("Error adding member");
                console.log(err);
            }
        });
    });
    

    /** ---------------------- ניהול פרויקטים ---------------------- **/
    $(document).on("click", "#showAddProjectModal", function () {
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
        loadMembersForSelection();
    });
    


    function updateMemberDropdowns(members) {
        $(".teamMember select.memberSelect").each(function () {
            let selectedValue = $(this).val(); // שמירה על הבחירה הקיימת
            let dropdown = $(this);
            dropdown.empty();
    
            // אוספים את כל החברים שכבר נבחרו
            let selectedMembers = $(".teamMember select.memberSelect").map(function () {
                return $(this).val();
            }).get();
    
            // מוסיפים רק את החברים שלא נבחרו או את החבר שנבחר כרגע
            members.forEach(member => {
                if (!selectedMembers.includes(member._id) || member._id === selectedValue) {
                    dropdown.append(`<option value="${member._id}">${member.name} (${member.email})</option>`);
                }
            });
    
            dropdown.val(selectedValue); // משחזרים את הבחירה הקודמת
        });
    }
    function loadMembersForSelection() {
        $.ajax({
            url: "http://localhost:3001/api/members/list",
            type: "GET",
            success: function (members) {
                updateMemberDropdowns(members);
            },
            error: function (err) {
                alert("Error loading members!!!");
                console.log(err);
            }
        });
    }
        
    


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
            const memberName = $(this).find(".memberSelect option:selected").text().split(" (")[0]; // קבלת שם העובד
            const memberEmail = $(this).find(".memberSelect option:selected").text().split(" (")[1].slice(0, -1); // קבלת האימייל
            const role = $(this).find(".memberRole").val();
        
            if (memberId && memberName && memberEmail && role) {
                newProject.team.push({ memberId, name: memberName, email: memberEmail, role });
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

    $(document).on("click", ".closeModal", function () {
        let modalId = $(this).closest(".modal").attr("id");
        closeModal(modalId);
    });
    

    // $("#loadProjects").click(function () {
        // $.ajax({
            // url: "http://localhost:3001/api/projects/list",
            // type: "GET",
            // success: function (projects) {
                // $("#projectList").empty();
                // projects.forEach(project => {
                    // const teamList = project.team.length > 0 
                        // ? project.team.map(member => `${member.name} (${member.role})`).join(", ") 
                        // : "No team members";
                        // const formattedDate = new Date(project.startDate).toISOString().slice(0, 16).replace("T", " ");
                    // $("#projectList").append(`
                        // <tr>
                            // <td>${project._id}</td>
                            // <td>${project.name}</td>
                            // <td><a href="mailto:${project.manager.email}" class="email-link">${project.manager.name} (${project.manager.email})</a></td>
                            // <td>${formattedDate}</td>
                            // <td>${teamList}</td>
                            // <td>
                                // <button class="viewTeam" data-id="${project._id}">View Team</button>
                                // <button class="deleteProject" data-id="${project._id}">Delete</button>
                            // </td>
                        // </tr>
                    // `);
                // });
            // },
            // error: function (err) {
                // alert("Error loading projects");
                // console.log(err);
            // }
        // });
    // });

    $(document).on("change", ".memberSelect", function () {
        loadMembersForSelection();
    });
    

    $(document).on("click", ".viewTeam", function () {
        const projectId = $(this).data("id");
    
        $.ajax({
            url: `http://localhost:3001/api/projects/${projectId}/team`,
            type: "GET",
            success: function (team) {
                if (team.length === 0) {
                    alert("No team members in this project.");
                    return;
                }
                let teamList = team.map(member => `${member.name} (${member.email}) - ${member.role}`).join("\n");
                alert(`Team Members:\n${teamList}`);
            },
            error: function (err) {
                alert("Error loading team members");
                console.log(err);
            }
        });
    });
   

    $(document).on("click", ".deleteProject", function () {
        const projectId = $(this).data("id");
    
        if (!confirm("Are you sure you want to delete this project?")) return;
    
        $.ajax({
            url: `http://localhost:3001/api/projects/${projectId}`,
            type: "DELETE",
            success: function () {
                alert("Project deleted successfully!");
                $("#loadProjects").click(); // רענון הרשימה אחרי מחיקה
            },
            error: function (err) {
                alert("Error deleting project");
                console.log(err);
            }
        });
    });
    
});
