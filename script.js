console.log("Welcome to WorkConnect!");

// Registration System

const workerBtn = document.getElementById("workerBtn");

const employerBtn = document.getElementById("employerBtn");

const workerFields = document.getElementById("workerFields");

const employerFields = document.getElementById("employerFields");

const role = document.getElementById("role");


// Worker Selection

if (workerBtn && employerBtn) {

    workerBtn.addEventListener("click", function () {

        workerFields.classList.remove("hidden");

        employerFields.classList.add("hidden");

        workerBtn.classList.add("active");

        employerBtn.classList.remove("active");

        role.value = "worker";

    });


    // Employer Selection

    employerBtn.addEventListener("click", function () {

        employerFields.classList.remove("hidden");

        workerFields.classList.add("hidden");

        employerBtn.classList.add("active");

        workerBtn.classList.remove("active");

        role.value = "employer";

    });

}


// Step 21.1 - Registration Form Validation

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Get form values

        const name = document.getElementById("fullName").value.trim();

        const phone = document.getElementById("phone").value.trim();

        const password = document.getElementById("password").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        const userRole = document.getElementById("role").value;

        const registerMessage = document.getElementById("registerMessage");

        // Function to display messages

        function showMessage(message, type) {

            registerMessage.textContent = message;

            registerMessage.className = type;

        }

        // Validate Name

        if (name === "") {

            showMessage("Please enter your full name.", "error-message");

            return;

        }

        // Validate Mobile Number

        if (!/^[0-9]{10}$/.test(phone)) {

            showMessage("Please enter a valid 10-digit mobile number.", "error-message");

            return;

        }

        // Validate Password

        if (password.length < 6) {

            showMessage("Password must contain at least 6 characters.", "error-message");

            return;

        }

        // Check Password

        if (password !== confirmPassword) {

            showMessage("Passwords do not match!", "error-message");

            return;

        }

        // Validate Worker Fields

        if (userRole === "worker") {

            const location = document.getElementById("workerLocation").value.trim();

            const skill = document.getElementById("workerSkill").value;

            const availability = document.getElementById("availability").value;

            if (!location || !skill || !availability) {

                showMessage("Please complete all worker details.", "error-message");

                return;

            }

        }

        // Validate Employer Fields

        if (userRole === "employer") {

            const businessName = document.getElementById("businessName").value.trim();

            const businessType = document.getElementById("businessType").value;

            const businessLocation = document.getElementById("businessLocation").value.trim();

            if (!businessName || !businessType || !businessLocation) {

                showMessage("Please complete all business details.", "error-message");

                return;

            }

        }

        // Get Existing Users

        let users = JSON.parse(
            localStorage.getItem("workConnectUsers")
        ) || [];

        // Check Duplicate Mobile Number

        const existingUser = users.find(function(user) {

            return user.phone === phone;

        });

        if (existingUser) {

            showMessage("This mobile number is already registered!", "error-message");

            return;

        }

        // Create User Object

        const user = {

            name: name,

            phone: phone,

            password: password,

            role: userRole,

            location: userRole === "worker"
                ? document.getElementById("workerLocation").value.trim()
                : document.getElementById("businessLocation").value.trim()

        };

        // Save Additional Details

        if (userRole === "worker") {

            user.skill = document.getElementById("workerSkill").value;

            user.availability = document.getElementById("availability").value;

        } else {

            user.businessName = document.getElementById("businessName").value.trim();

            user.businessType = document.getElementById("businessType").value;

        }

        // Store User

        users.push(user);

        localStorage.setItem(
            "workConnectUsers",
            JSON.stringify(users)
        );

        // Success Message

        showMessage("Registration successful! Please login.", "success-message");

        registerMessage.textContent = "Registration successful! Please login.";

        registerMessage.className = "success-message";

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);

        window.location.href = "login.html";

    });

}

// Login System

let selectedLoginRole = "worker";

const workerLoginBtn = document.getElementById("workerLoginBtn");

const employerLoginBtn = document.getElementById("employerLoginBtn");


// Select Worker

if (workerLoginBtn && employerLoginBtn) {

    workerLoginBtn.addEventListener("click", function () {

        selectedLoginRole = "worker";

        workerLoginBtn.classList.add("active");

        employerLoginBtn.classList.remove("active");

    });


    // Select Employer

    employerLoginBtn.addEventListener("click", function () {

        selectedLoginRole = "employer";

        employerLoginBtn.classList.add("active");

        workerLoginBtn.classList.remove("active");

    });

}


// Login Form

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const phone = document.getElementById("loginPhone").value.trim();
        const password = document.getElementById("loginPassword").value;

        const loginMessage = document.getElementById("loginMessage");

        // Clear Previous Message
        loginMessage.textContent = "";
        loginMessage.className = "";

        // Validate Mobile Number
        if (!/^[0-9]{10}$/.test(phone)) {

            loginMessage.textContent = "Please enter a valid 10-digit mobile number.";
            loginMessage.className = "error-message";
            return;
        }

        // Validate Password
        if (password.trim() === "") {

            loginMessage.textContent = "Please enter your password.";
            loginMessage.className = "error-message";
            return;
        }

        // Get Registered Users
        const users = JSON.parse(localStorage.getItem("workConnectUsers")) || [];

        // Find User
        const user = users.find(function (u) {

            return u.phone === phone &&
                   u.password === password &&
                   u.role === selectedLoginRole;

        });

        // Check Login Details
        if (user) {

            loginMessage.textContent = "Login successful!";
            loginMessage.className = "success-message";

            localStorage.setItem("loggedInUser", JSON.stringify(user));

            setTimeout(function () {

                if (user.role === "worker") {

                    window.location.href = "worker-dashboard.html";

                } else {

                    window.location.href = "employer-dashboard.html";

                }

            }, 1000);

        } else {

            loginMessage.textContent = "Invalid mobile number, password or account type.";
            loginMessage.className = "error-message";

        }

    });

}

// Worker Dashboard

const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

const logoutBtn = document.getElementById("logoutBtn");


if (window.location.pathname.endsWith("worker-dashboard.html")) {

    // Check Login

    if (!currentUser || currentUser.role !== "worker") {

        window.location.href = "login.html";

    } else {

        // Welcome Message

        document.getElementById("welcomeMessage").textContent =
            "Welcome, " + currentUser.name + "!";

            // Update Applied Jobs Count

const applications = JSON.parse(
    localStorage.getItem("workConnectApplications")
) || [];

const myApplications = applications.filter(function(application) {
    return application.workerPhone === currentUser.phone;
});

document.getElementById("appliedCount").textContent =
    myApplications.length;

        document.getElementById("workerName").textContent =
            currentUser.name;


        // Worker Information

        document.getElementById("workerSkill").textContent =
            currentUser.skill || "Not added";

        document.getElementById("workerLocation").textContent =
            currentUser.location || "Not added";


        // Profile Information

        document.getElementById("profileName").textContent =
            currentUser.name;

        document.getElementById("profilePhone").textContent =
            currentUser.phone;

        document.getElementById("profileSkill").textContent =
            currentUser.skill || "Not added";

        document.getElementById("profileLocation").textContent =
            currentUser.location || "Not added";

        document.getElementById("profileAvailability").textContent =
            currentUser.availability || "Not added";

    }

}


// Worker Logout

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("loggedInUser");

        showNotification("Logged out successfully!", "success");

        setTimeout(function() {
            window.location.href = "login.html";
        }, 1500);

    });

}

// Employer Dashboard

const employerLogoutBtn =
    document.getElementById("employerLogoutBtn");


if (window.location.pathname.endsWith("employer-dashboard.html")) {

    const employer = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    // Check Employer Login

    if (!employer || employer.role !== "employer") {

        window.location.href = "login.html";

    } else {

        // Welcome Information

        document.getElementById("employerWelcome").textContent =
            "Welcome, " + employer.name + "!";

        document.getElementById("employerName").textContent =
            employer.name;


        // Business Information

        document.getElementById("businessName").textContent =
            employer.businessName || "Not added";

        document.getElementById("businessLocation").textContent =
            employer.location || "Not added";


        // Profile Information

        document.getElementById("profileEmployerName").textContent =
            employer.name;

        document.getElementById("profileEmployerPhone").textContent =
            employer.phone;

        document.getElementById("profileBusinessName").textContent =
            employer.businessName || "Not added";

        document.getElementById("profileBusinessType").textContent =
            employer.businessType || "Not added";

        document.getElementById("profileBusinessLocation").textContent =
            employer.location || "Not added";


        // Get Posted Jobs

        const jobs = JSON.parse(
            localStorage.getItem("workConnectJobs")
        ) || [];

        const myJobs = jobs.filter(
            job => job.employerPhone === employer.phone
        );

        document.getElementById("totalJobs").textContent =
            myJobs.length;


        // Display Jobs

        const employerJobs = document.getElementById("employerJobs");

        employerJobs.innerHTML = "";

        if (myJobs.length === 0) {

            employerJobs.innerHTML = `
                <div class="empty-state">
                    <h3>No Jobs Posted Yet</h3>
                    <p>You haven't posted any jobs yet.</p>
                    <p>Create your first job posting to get started!</p>
                </div>
            `;

        }
        
        else {

            myJobs.forEach(function(job) {

                const applications = JSON.parse(
                    localStorage.getItem("workConnectApplications")
                    ) || [];

                const applicationCount = applications.filter(function(application) {
                    return application.jobId === job.id;
                }).length;

                employerJobs.innerHTML += `

                    <div class="employer-job-card">

                        <span class="job-category">
                            ${job.category}
                        </span>

                        <h3>${job.title}</h3>

                        <p>${job.description}</p>

                        <p>📍 ${job.location}</p>

                        <p>💰 ₹${job.salary} / Day</p>

                        <p>👥 Workers: ${job.workers}</p>

                        <p>📩 Applications Received: ${applicationCount}</p>

                        <button class="view-applications-btn" data-job-id="${job.id}">👥 View Applications</button>

                        <p>📅 Posted: ${job.postedDate}</p>

                        <span class="job-status">${job.status}</span>

                        <button class="edit-job-btn" data-job-id="${job.id}">✏️ Edit Job</button>

                        <button class="delete-job-btn" data-job-id="${job.id}">🗑️ Delete Job</button>

                        <button class="toggle-job-btn" data-job-id="${job.id}">${job.status === "Active" ? "🔒 Close Job" : "🔓 Reopen Job"}
                        </button>

                    </div>

                `;

            });

        }

    }

}


// Step 15.3.1 - Custom Edit Job Modal

const employerJobsContainer = document.getElementById("employerJobs");

// View My Jobs Button

const viewJobsBtn = document.getElementById("viewJobsBtn");

if (viewJobsBtn && employerJobsContainer) {

    viewJobsBtn.addEventListener("click", function() {

        employerJobsContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}

const editJobModal = document.getElementById("editJobModal");

const editJobTitle = document.getElementById("editJobTitle");
const editJobDescription = document.getElementById("editJobDescription");
const editJobLocation = document.getElementById("editJobLocation");
const editJobSalary = document.getElementById("editJobSalary");

const saveJobChangesBtn = document.getElementById("saveJobChangesBtn");
const cancelJobEditBtn = document.getElementById("cancelJobEditBtn");

let editingJobId = null;


// Open Edit Modal

if (employerJobsContainer && editJobModal) {

    employerJobsContainer.addEventListener("click", function(event) {

        if (event.target.classList.contains("edit-job-btn")) {

            editingJobId = Number(event.target.dataset.jobId);

            const jobs = JSON.parse(
                localStorage.getItem("workConnectJobs")
            ) || [];

            const job = jobs.find(function(job) {
                return job.id === editingJobId;
            });

            if (!job) {
                showNotification("Job not found!", "error");
                return;
            }

            // Fill Existing Job Details

            editJobTitle.value = job.title;
            editJobDescription.value = job.description;
            editJobLocation.value = job.location;
            editJobSalary.value = job.salary;

            // Show Modal

            editJobModal.classList.remove("hidden");

        }

    });

}


// Save Job Changes

if (saveJobChangesBtn) {

    saveJobChangesBtn.addEventListener("click", function() {

        const title = editJobTitle.value.trim();
        const description = editJobDescription.value.trim();
        const location = editJobLocation.value.trim();
        const salary = Number(editJobSalary.value);

        if (
            title === "" ||
            description === "" ||
            location === "" ||
            !Number.isFinite(salary) ||
            salary <= 0
        ) {

            showNotification("Please enter valid job details!", "error");
            return;

        }

        const jobs = JSON.parse(
            localStorage.getItem("workConnectJobs")
        ) || [];

        const job = jobs.find(function(job) {
            return job.id === editingJobId;
        });

        if (!job) {
            showNotification("Job not found!", "error");
            return;
        }

        // Update Job Details

        job.title = title;
        job.description = description;
        job.location = location;
        job.salary = salary;

        localStorage.setItem(
            "workConnectJobs",
            JSON.stringify(jobs)
        );

        editJobModal.classList.add("hidden");

        showNotification("Job updated successfully!", "success");

        setTimeout(function() {
            location.reload();
        }, 1000);

    });

}


// Cancel Editing

if (cancelJobEditBtn) {

    cancelJobEditBtn.addEventListener("click", function() {

        editJobModal.classList.add("hidden");

        editingJobId = null;

    });

}

// Step 15.4.2 - Custom Delete Job Modal

const deleteJobModal = document.getElementById("deleteJobModal");
const confirmDeleteJobBtn = document.getElementById("confirmDeleteJobBtn");
const cancelDeleteJobBtn = document.getElementById("cancelDeleteJobBtn");

let deletingJobId = null;


// Open Delete Confirmation Modal

if (employerJobsContainer && deleteJobModal) {

    employerJobsContainer.addEventListener("click", function(event) {

        if (event.target.classList.contains("delete-job-btn")) {

            deletingJobId = Number(event.target.dataset.jobId);

            deleteJobModal.classList.remove("hidden");

        }

    });

}


// Confirm Delete

if (confirmDeleteJobBtn) {

    confirmDeleteJobBtn.addEventListener("click", function() {

        const jobs = JSON.parse(
            localStorage.getItem("workConnectJobs")
        ) || [];

        const updatedJobs = jobs.filter(function(job) {
            return job.id !== deletingJobId;
        });

        if (updatedJobs.length === jobs.length) {
            showNotification("Job not found!", "error");
            return;
        }

        localStorage.setItem(
            "workConnectJobs",
            JSON.stringify(updatedJobs)
        );

        deleteJobModal.classList.add("hidden");

        showNotification("Job deleted successfully!", "success");

        setTimeout(function() {
            location.reload();
        }, 1000);

    });

}


// Cancel Delete

if (cancelDeleteJobBtn) {

    cancelDeleteJobBtn.addEventListener("click", function() {

        deleteJobModal.classList.add("hidden");

        deletingJobId = null;

    });

}

// Step 15.5.2 - Custom Close / Reopen Job Modal

const toggleJobModal = document.getElementById("toggleJobModal");

const toggleJobModalTitle = document.getElementById("toggleJobModalTitle");

const toggleJobModalMessage = document.getElementById("toggleJobModalMessage");

const confirmToggleJobBtn = document.getElementById("confirmToggleJobBtn");

const cancelToggleJobBtn = document.getElementById("cancelToggleJobBtn");

let togglingJobId = null;
let nextJobStatus = "";


// Open Confirmation Modal

if (employerJobsContainer && toggleJobModal) {

    employerJobsContainer.addEventListener("click", function(event) {

        if (event.target.classList.contains("toggle-job-btn")) {

            togglingJobId = Number(event.target.dataset.jobId);

            const jobs = JSON.parse(
                localStorage.getItem("workConnectJobs")
            ) || [];

            const job = jobs.find(function(job) {
                return job.id === togglingJobId;
            });

            if (!job) {
                showNotification("Job not found!", "error");
                return;
            }

            if (job.status === "Active") {

                nextJobStatus = "Closed";

                toggleJobModalTitle.textContent = "Close Job";

                toggleJobModalMessage.textContent =
                    "Are you sure you want to close this job?";

            } else {

                nextJobStatus = "Active";

                toggleJobModalTitle.textContent = "Reopen Job";

                toggleJobModalMessage.textContent =
                    "Are you sure you want to reopen this job?";

            }

            toggleJobModal.classList.remove("hidden");

        }

    });

}


// Confirm Close / Reopen

if (confirmToggleJobBtn) {

    confirmToggleJobBtn.addEventListener("click", function() {

        const jobs = JSON.parse(
            localStorage.getItem("workConnectJobs")
        ) || [];

        const job = jobs.find(function(job) {
            return job.id === togglingJobId;
        });

        if (!job) {
            showNotification("Job not found!", "error");
            toggleJobModal.classList.add("hidden");
            return;
        }

        job.status = nextJobStatus;

        localStorage.setItem(
            "workConnectJobs",
            JSON.stringify(jobs)
        );

        toggleJobModal.classList.add("hidden");

        if (nextJobStatus === "Closed") {

            showNotification("Job closed successfully!", "success");

        } else {

            showNotification("Job reopened successfully!", "success");

        }

        setTimeout(function() {
            location.reload();
        }, 1000);

    });

}


// Cancel Close / Reopen

if (cancelToggleJobBtn) {

    cancelToggleJobBtn.addEventListener("click", function() {

        toggleJobModal.classList.add("hidden");

        togglingJobId = null;
        nextJobStatus = "";

    });

}



// Employer Logout

if (employerLogoutBtn) {

    employerLogoutBtn.addEventListener("click", function() {

        localStorage.removeItem("loggedInUser");

        showNotification("Logged out successfully!", "success");

        setTimeout(function() {
            window.location.href = "login.html";
        }, 1500);

    });

}

// Worker Profile Editing

const workerEditBtn = document.getElementById("editProfileBtn");
const workerEditForm = document.getElementById("editProfileForm");
const workerCancelBtn = document.getElementById("cancelEditBtn");

const profileMessage = document.getElementById("profileMessage");


if (workerEditBtn && workerEditForm) {

    workerEditBtn.addEventListener("click", function () {

        // Display the edit form
        workerEditForm.classList.remove("hidden");

        // Fill existing profile information
        document.getElementById("editName").value = currentUser.name;
        document.getElementById("editPhone").value = currentUser.phone;
        document.getElementById("editSkill").value = currentUser.skill;
        document.getElementById("editLocation").value = currentUser.location;
        document.getElementById("editAvailability").value = currentUser.availability;

        profileMessage.textContent = "";
        profileMessage.className = "";

    });

}


// Cancel Editing

if (workerCancelBtn) {

    workerCancelBtn.addEventListener("click", function () {

        workerEditForm.classList.add("hidden");

        profileMessage.textContent = "";
        profileMessage.className = "";

    });

}


// Save Updated Worker Profile

const saveProfileBtn = document.getElementById("saveProfileBtn");

if (saveProfileBtn) {

    saveProfileBtn.addEventListener("click", function () {

        // Get Updated Values

        const updatedName = document.getElementById("editName").value.trim();
        const updatedPhone = document.getElementById("editPhone").value.trim();
        const updatedSkill = document.getElementById("editSkill").value.trim();
        const updatedLocation = document.getElementById("editLocation").value.trim();
        const updatedAvailability = document.getElementById("editAvailability").value.trim();


        // Clear Previous Message

        profileMessage.textContent = "";
        profileMessage.className = "";


        // Validate Empty Fields

        if (!updatedName || !updatedPhone || !updatedSkill ||
            !updatedLocation || !updatedAvailability) {

            profileMessage.textContent = "Please fill in all fields!";
            profileMessage.className = "error-message";

            return;
        }


        // Validate Mobile Number

        if (!/^[0-9]{10}$/.test(updatedPhone)) {

            profileMessage.textContent = "Please enter a valid 10-digit mobile number!";
            profileMessage.className = "error-message";

            return;
        }


        // Get Registered Users

        let users = JSON.parse(localStorage.getItem("workConnectUsers")) || [];


        // Check Duplicate Phone Number

        const phoneExists = users.some(function (user) {

            return user.phone === updatedPhone &&
                   user.phone !== currentUser.phone;

        });


        if (phoneExists) {

            profileMessage.textContent = "This mobile number is already registered!";
            profileMessage.className = "error-message";

            return;
        }


        const oldPhone = currentUser.phone;


        // Update Current User

        currentUser.name = updatedName;
        currentUser.phone = updatedPhone;
        currentUser.skill = updatedSkill;
        currentUser.location = updatedLocation;
        currentUser.availability = updatedAvailability;


        // Update Registered Users List

        const userIndex = users.findIndex(function (user) {

            return user.phone === oldPhone &&
                   user.role === "worker";

        });


        if (userIndex !== -1) {

            users[userIndex] = currentUser;

        }


        // Save Updated Information

        localStorage.setItem("workConnectUsers", JSON.stringify(users));

        localStorage.setItem("loggedInUser", JSON.stringify(currentUser));


        // Update Dashboard Details

        document.getElementById("workerName").textContent = updatedName;

        document.getElementById("workerSkill").textContent = updatedSkill;

        document.getElementById("workerLocation").textContent = updatedLocation;


        // Update Profile Information

        document.getElementById("profileName").textContent = updatedName;

        document.getElementById("profilePhone").textContent = updatedPhone;

        document.getElementById("profileSkill").textContent = updatedSkill;

        document.getElementById("profileLocation").textContent = updatedLocation;

        document.getElementById("profileAvailability").textContent = updatedAvailability;


        // Display Success Message

        profileMessage.textContent = "Profile updated successfully!";

        profileMessage.className = "success-message";


        // Hide Edit Form

        workerEditForm.classList.add("hidden");

    });

}

// Step 7.2 - Post a Job

const postJobForm = document.getElementById("postJobForm");

if (postJobForm) {

    postJobForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const postJobMessage = document.getElementById("postJobMessage");

        // Clear Previous Message
        postJobMessage.textContent = "";
        postJobMessage.className = "";

        // Check Logged-in Employer
        if (!currentUser || currentUser.role !== "employer") {

            postJobMessage.textContent = "Please login as an employer!";
            postJobMessage.className = "error-message";

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1500);

            return;
        }

        // Get Job Details
        const jobTitle = document.getElementById("jobTitle").value.trim();
        const jobCategory = document.getElementById("jobCategory").value;
        const jobDescription = document.getElementById("jobDescription").value.trim();
        const jobLocation = document.getElementById("jobLocation").value.trim();
        const jobSalary = Number(document.getElementById("jobSalary").value);
        const workers = Number(document.getElementById("workersRequired").value);

        // Validate Empty Fields
        if (!jobTitle || !jobCategory || !jobDescription ||
            !jobLocation || !document.getElementById("jobSalary").value ||
            !document.getElementById("workersRequired").value) {

            postJobMessage.textContent = "Please fill in all fields!";
            postJobMessage.className = "error-message";

            return;
        }

        // Validate Salary
        if (!Number.isFinite(jobSalary) || jobSalary <= 0) {

            postJobMessage.textContent = "Please enter a valid salary!";
            postJobMessage.className = "error-message";

            return;
        }

        // Validate Number of Workers
        if (!Number.isInteger(workers) || workers <= 0) {

            postJobMessage.textContent = "Please enter a valid number of workers!";
            postJobMessage.className = "error-message";

            return;
        }

        // Create Job Object
        const newJob = {

            id: Date.now(),
            employerPhone: currentUser.phone,
            employerName: currentUser.name,
            businessName: currentUser.businessName,
            title: jobTitle,
            category: jobCategory,
            description: jobDescription,
            location: jobLocation,
            salary: jobSalary,
            workers: workers,
            status: "Active",
            postedDate: new Date().toLocaleDateString()

        };

        // Get Existing Jobs
        let jobs = JSON.parse(localStorage.getItem("workConnectJobs")) || [];

        // Add New Job
        jobs.push(newJob);

        // Save Jobs
        localStorage.setItem("workConnectJobs", JSON.stringify(jobs));

        // Display Success Message
        postJobMessage.textContent = "Job posted successfully!";
        postJobMessage.className = "success-message";

        // Redirect to Employer Dashboard
        setTimeout(function () {

            window.location.href = "employer-dashboard.html";

        }, 1500);

    });

}



// Employer Profile Editing

const employerEditBtn = document.getElementById("editEmployerProfileBtn");
const employerEditForm = document.getElementById("editEmployerProfileForm");
const employerCancelBtn = document.getElementById("cancelEmployerEditBtn");

const employerProfileMessage = document.getElementById("employerProfileMessage");


// Display Edit Form

if (employerEditBtn && employerEditForm) {

    employerEditBtn.addEventListener("click", function () {

        employerEditForm.classList.remove("hidden");

        // Fill existing information
        document.getElementById("editEmployerName").value = currentUser.name;
        document.getElementById("editEmployerPhone").value = currentUser.phone;
        document.getElementById("editBusinessName").value = currentUser.businessName || "";
        document.getElementById("editBusinessType").value = currentUser.businessType || "";
        document.getElementById("editBusinessLocation").value = currentUser.location || "";

        employerProfileMessage.textContent = "";
        employerProfileMessage.className = "";

    });

}


// Cancel Editing

if (employerCancelBtn) {

    employerCancelBtn.addEventListener("click", function () {

        employerEditForm.classList.add("hidden");

        employerProfileMessage.textContent = "";
        employerProfileMessage.className = "";

    });

}


// Save Updated Employer Profile

const saveEmployerProfileBtn = document.getElementById("saveEmployerProfileBtn");

if (saveEmployerProfileBtn) {

    saveEmployerProfileBtn.addEventListener("click", function () {

        // Get Updated Values

        const updatedName = document.getElementById("editEmployerName").value.trim();
        const updatedPhone = document.getElementById("editEmployerPhone").value.trim();
        const updatedBusinessName = document.getElementById("editBusinessName").value.trim();
        const updatedBusinessType = document.getElementById("editBusinessType").value.trim();
        const updatedLocation = document.getElementById("editBusinessLocation").value.trim();


        // Clear Previous Message

        employerProfileMessage.textContent = "";
        employerProfileMessage.className = "";


        // Validate Empty Fields

        if (!updatedName || !updatedPhone || !updatedBusinessName ||
            !updatedBusinessType || !updatedLocation) {

            employerProfileMessage.textContent = "Please fill in all fields!";
            employerProfileMessage.className = "error-message";

            return;
        }


        // Validate Mobile Number

        if (!/^[0-9]{10}$/.test(updatedPhone)) {

            employerProfileMessage.textContent = "Please enter a valid 10-digit mobile number!";
            employerProfileMessage.className = "error-message";

            return;
        }


        // Get Registered Users

        let users = JSON.parse(localStorage.getItem("workConnectUsers")) || [];

        const oldPhone = currentUser.phone;


        // Check Duplicate Phone Number

        const phoneExists = users.some(function (user) {

            return user.phone === updatedPhone &&
                   user.phone !== oldPhone;

        });


        if (phoneExists) {

            employerProfileMessage.textContent = "This mobile number is already registered!";
            employerProfileMessage.className = "error-message";

            return;
        }


        // Find Employer Account

        const userIndex = users.findIndex(function (user) {

            return user.phone === oldPhone &&
                   user.role === "employer";

        });


        if (userIndex === -1) {

            employerProfileMessage.textContent = "Employer account not found!";
            employerProfileMessage.className = "error-message";

            return;
        }


        // Update Employer Information

        currentUser.name = updatedName;
        currentUser.phone = updatedPhone;
        currentUser.businessName = updatedBusinessName;
        currentUser.businessType = updatedBusinessType;
        currentUser.location = updatedLocation;


        // Update LocalStorage

        users[userIndex] = currentUser;

        localStorage.setItem("workConnectUsers", JSON.stringify(users));

        localStorage.setItem("loggedInUser", JSON.stringify(currentUser));


        // Update Dashboard Information

        document.getElementById("employerWelcome").textContent = "Welcome, " + updatedName + "!";

        document.getElementById("employerName").textContent = updatedName;

        document.getElementById("businessName").textContent = updatedBusinessName;

        document.getElementById("businessLocation").textContent = updatedLocation;


        // Update Profile Information

        document.getElementById("profileEmployerName").textContent = updatedName;

        document.getElementById("profileEmployerPhone").textContent = updatedPhone;

        document.getElementById("profileBusinessName").textContent = updatedBusinessName;

        document.getElementById("profileBusinessType").textContent = updatedBusinessType;

        document.getElementById("profileBusinessLocation").textContent = updatedLocation;


        // Display Success Message

        employerProfileMessage.textContent = "Employer profile updated successfully!";

        employerProfileMessage.className = "success-message";


        // Hide Edit Form

        employerEditForm.classList.add("hidden");

    });

}


// Step 8.2 - Display, Search and Filter Available Jobs

const availableJobsContainer = document.getElementById("availableJobs");

if (availableJobsContainer) {

    const jobs = JSON.parse(localStorage.getItem("workConnectJobs")) || [];

    const activeJobs = jobs.filter(function(job) {
        return job.status === "Active";
    });

    const jobCategoryFilter = document.getElementById("jobCategoryFilter");

    const jobSearchInput = document.getElementById("jobSearchInput");

    const jobSearchBtn = document.getElementById("jobSearchBtn");


    // Step 1: Load Job Categories Automatically

    if (jobCategoryFilter) {

        const categories = [...new Set(
            activeJobs.map(function(job) {
                return job.category;
            })
        )];

        categories.forEach(function(category) {

            jobCategoryFilter.innerHTML += `
                <option value="${category}">${category}</option>
            `;

        });

    }


    // Step 2: Function to Display and Filter Jobs

    function renderWorkConnectAvailableJobs(searchText = "") {

        const filteredJobs = activeJobs.filter(function(job) {

            const matchesSearch =
                job.title.toLowerCase().includes(searchText) ||
                job.category.toLowerCase().includes(searchText) ||
                job.location.toLowerCase().includes(searchText);

            const selectedCategory = jobCategoryFilter
                ? jobCategoryFilter.value
                : "all";

            const matchesCategory =
                selectedCategory === "all" ||
                job.category === selectedCategory;

            return matchesSearch && matchesCategory;

        });


if (filteredJobs.length === 0) {

    if (activeJobs.length === 0) {

        availableJobsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No Jobs Available</h3>
                <p>No jobs available right now. Please check back later.</p>
            </div>
        `;

    } else {

        availableJobsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No Matching Jobs Found</h3>
                <p>Try changing your search or category filter.</p>
            </div>
        `;

    }

}
        
        else {

            availableJobsContainer.innerHTML = filteredJobs.map(function(job) {

                return `
                    <div class="job-card">

                        <span class="job-category">${job.category}</span>

                        <h3>${job.title}</h3>

                        <p>${job.description}</p>

                        <p>📍 Location: ${job.location}</p>

                        <p>💰 Salary: ₹${job.salary} / Day</p>

                        <p>👥 Workers Required: ${job.workers}</p>

                        <p>🏢 Employer: ${job.businessName}</p>

                        <a href="job-details.html?jobId=${job.id}" class="view-details-btn">
                            View Details
                        </a>

                        <button class="apply-btn" data-job-id="${job.id}">
                            Apply Now
                        </button>

                    </div>
                `;

            }).join("");

        }

    }


    // Step 3: Display All Jobs Initially

    renderWorkConnectAvailableJobs();


    // Step 4: Search Button Click

    if (jobSearchBtn && jobSearchInput) {

        jobSearchBtn.addEventListener("click", function() {

            const searchText = jobSearchInput.value.trim().toLowerCase();

            renderWorkConnectAvailableJobs(searchText);

        });


        // Search Using Enter Key

        jobSearchInput.addEventListener("keydown", function(event) {

            if (event.key === "Enter") {

                const searchText = jobSearchInput.value.trim().toLowerCase();

                renderWorkConnectAvailableJobs(searchText);

            }

        });

    }


    // Step 5: Category Filter Change

    if (jobCategoryFilter) {

        jobCategoryFilter.addEventListener("change", function() {

            const searchText = jobSearchInput
                ? jobSearchInput.value.trim().toLowerCase()
                : "";

            renderWorkConnectAvailableJobs(searchText);

        });

    }

}

// Step 9.2 - Worker Job Application

const availableJobs = document.getElementById("availableJobs");

if (availableJobs) {

    availableJobs.addEventListener("click", function(event) {

        // Check whether Apply button was clicked

        if (!event.target.dataset.jobId) {
            return;
        }

        // Check logged-in worker

        if (!currentUser || currentUser.role !== "worker") {

            showNotification(
                "Please login as a worker to apply for jobs!",
                "error"
            );

            setTimeout(function() {
                window.location.href = "login.html";
            }, 1500);

            return;
        }

        // Get selected job ID

        const jobId = Number(event.target.dataset.jobId);

        // Get all jobs

        const jobs = JSON.parse(
            localStorage.getItem("workConnectJobs")
        ) || [];

        const selectedJob = jobs.find(function(job) {
            return job.id === jobId;
        });

        if (!selectedJob) {
            showNotification("Job not found!", "error");
            return;
        }

        // Get existing applications

        let applications = JSON.parse(
            localStorage.getItem("workConnectApplications")
        ) || [];

        // Check duplicate application

        const alreadyApplied = applications.some(function(application) {
            return application.jobId === jobId &&
                   application.workerPhone === currentUser.phone;
        });

        if (alreadyApplied) {
            showNotification("You have already applied for this job!", "error");
            return;
        }

        // Create application object

        const newApplication = {
            id: Date.now(),
            jobId: jobId,
            workerName: currentUser.name,
            workerPhone: currentUser.phone,
            workerSkill: currentUser.skill,
            employerPhone: selectedJob.employerPhone,
            jobTitle: selectedJob.title,
            businessName: selectedJob.businessName,
            status: "Pending",
            appliedDate: new Date().toLocaleDateString()
        };

        // Save application

        applications.push(newApplication);

        localStorage.setItem(
            "workConnectApplications",
            JSON.stringify(applications)
        );

        showNotification(
            "Your application has been submitted successfully!",
            "success"
        );

    });

}

// Custom Notification Function

function showNotification(message, type = "success") {

    const notification = document.createElement("div");

    notification.className = `custom-notification ${type}`;

    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(function() {
        notification.remove();
    }, 3000);

}




// Step 10.2 - Display and Filter Worker Applications

const employerApplicationsContainer = document.getElementById("employerApplications");

const employerApplicationFilter = document.getElementById("employerApplicationFilter");

if (employerApplicationsContainer) {

    // Get logged-in employer

    const employer = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (employer && employer.role === "employer") {

        // Get all applications

        const applications = JSON.parse(
            localStorage.getItem("workConnectApplications")
        ) || [];

        // Get applications belonging to this employer

        const myApplications = applications.filter(function(application) {
            return application.employerPhone === employer.phone;
        });

        // Update application statistics

document.getElementById("totalApplicationsStat").textContent =
    myApplications.length;

    // Update Employer Dashboard Total Applications Card

document.getElementById("totalApplications").textContent =
    myApplications.length;

document.getElementById("pendingApplications").textContent =
    myApplications.filter(function(application) {
        return application.status === "Pending";
    }).length;

document.getElementById("acceptedApplications").textContent =
    myApplications.filter(function(application) {
        return application.status === "Accepted";
    }).length;

document.getElementById("rejectedApplications").textContent =
    myApplications.filter(function(application) {
        return application.status === "Rejected";
    }).length;

        // Function to display applications

        function displayEmployerApplications(status) {

            employerApplicationsContainer.innerHTML = "";

            // Filter applications by status

            let filteredApplications = myApplications;

            if (status !== "All") {

                filteredApplications = myApplications.filter(function(application) {
                    return application.status === status;
                });

            }

            // Check whether applications exist

            if (filteredApplications.length === 0) {

    if (myApplications.length === 0) {

        employerApplicationsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No Applications Received Yet</h3>
                <p>Applications will appear here when workers apply for your jobs.</p>
            </div>
        `;

    } else {

        employerApplicationsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No ${status} Applications</h3>
                <p>There are no applications with this status.</p>
            </div>
        `;

    }

    return;
}

            // Display applications

            filteredApplications.forEach(function(application) {

                employerApplicationsContainer.innerHTML += `

                    <div class="job-card">

                        <h3>${application.workerName}</h3>

                        <p><strong>Job:</strong> ${application.jobTitle}</p>

                        <p><strong>Mobile:</strong> ${application.workerPhone}</p>

                        <p><strong>Skill:</strong> ${application.workerSkill}</p>

                        <p><strong>Applied Date:</strong> ${application.appliedDate}</p>

                        <p><strong>Status:</strong> ${application.status}</p>

                        <div class="application-actions">

                            <button class="accept-btn" data-id="${application.id}">
                                Accept
                            </button>

                            <button class="reject-btn" data-id="${application.id}">
                                Reject
                            </button>

                        </div>

                    </div>

                `;

            });

        }

        // Display all applications initially

        displayEmployerApplications("All");

        // Filter applications when dropdown changes

        if (employerApplicationFilter) {

            employerApplicationFilter.addEventListener("change", function() {

                displayEmployerApplications(this.value);

            });

        }

    }

}

// Step 10.4 - Accept and Reject Applications

if (employerApplicationsContainer) {

    employerApplicationsContainer.addEventListener("click", function (event) {

        const applicationId = Number(event.target.dataset.id);

        // Check Accept button
        if (event.target.classList.contains("accept-btn")) {

            updateApplicationStatus(applicationId, "Accepted");

        }

        // Check Reject button
        if (event.target.classList.contains("reject-btn")) {

            updateApplicationStatus(applicationId, "Rejected");

        }

    });

}

// Function to update application status and generate notifications

function updateApplicationStatus(applicationId, newStatus) {

    let applications = JSON.parse(
        localStorage.getItem("workConnectApplications")
    ) || [];

    // Find application

    const applicationIndex = applications.findIndex(function(application) {
        return application.id === applicationId;
    });

    if (applicationIndex === -1) {
        showNotification("Application not found!", "error");
        return;
    }

    // Get selected application

    const application = applications[applicationIndex];

    const oldStatus = application.status;

    // Update status

    application.status = newStatus;

    // Save updated applications

    localStorage.setItem(
        "workConnectApplications",
        JSON.stringify(applications)
    );

    // Generate notification only when status changes

    if (oldStatus !== newStatus) {

        let notifications = JSON.parse(
            localStorage.getItem("workConnectNotifications")
        ) || [];

        const notification = {

            id: Date.now(),

            workerPhone: application.workerPhone,

            applicationId: application.id,

            message: `Your application for ${application.jobTitle} has been ${newStatus}.`,

            status: newStatus,

            date: new Date().toLocaleString(),

            read: false

        };

        notifications.push(notification);

        // Save notifications

        localStorage.setItem(
            "workConnectNotifications",
            JSON.stringify(notifications)
        );

    }

    showNotification(
    "Application " + newStatus + " successfully!",
    "success"
);

// Refresh application display

setTimeout(function() {
    location.reload();
}, 1000);

}

// Step 11.2 – Display Worker's Applications

const workerApplicationsContainer = document.getElementById("workerApplications");

if (workerApplicationsContainer && currentUser && currentUser.role === "worker") {

    const applications = JSON.parse(
        localStorage.getItem("workConnectApplications")
    ) || [];

    const jobs = JSON.parse(
        localStorage.getItem("workConnectJobs")
    ) || [];

    const myApplications = applications.filter(function(application) {
        return application.workerPhone === currentUser.phone;
    });

    if (myApplications.length === 0) {

    workerApplicationsContainer.innerHTML = `
        <div class="empty-state">
            <h3>No Applications Yet</h3>
            <p>You haven't applied for any jobs yet.</p>
            <p>Explore available jobs to get started!</p>
        </div>
    `;

}
    
    
    else {

        workerApplicationsContainer.innerHTML = myApplications.map(function(application) {

            const job = jobs.find(function(job) {
                return job.id === application.jobId;
            });

            return `
                <div class="application-card">

                    <h3>${application.jobTitle}</h3>

                    <p><strong>Business:</strong> ${application.businessName}</p>

                    <p><strong>Location:</strong> ${job ? job.location : "Not available"}</p>

                    <p><strong>Salary:</strong> ${job ? job.salary : "Not available"}</p>

                    <p><strong>Applied Date:</strong> ${application.appliedDate}</p>

                    <p><strong>Status:</strong> ${application.status}</p>

                </div>
            `;

        }).join("");

    }
}

// Step 14.3 - Display Complete Job Details

const jobDetailsContainer = document.getElementById("jobDetails");

if (jobDetailsContainer) {

    // Get Job ID from URL
    const urlParams = new URLSearchParams(window.location.search);

    const jobId = urlParams.get("jobId");

    // Get Jobs from localStorage
    const jobs = JSON.parse(localStorage.getItem("workConnectJobs")) || [];

    // Find Selected Job
    const selectedJob = jobs.find(function(job) {
        return String(job.id) === jobId;
    });

    if (selectedJob) {

        jobDetailsContainer.innerHTML = `

            <span class="job-category">${selectedJob.category}</span>

            <h2>${selectedJob.title}</h2>

            <p><strong>Job Description:</strong></p>
            <p>${selectedJob.description}</p>

            <p><strong>📍 Location:</strong> ${selectedJob.location}</p>

            <p><strong>💰 Salary:</strong> ₹${selectedJob.salary} / Day</p>

            <p><strong>👥 Workers Required:</strong> ${selectedJob.workers}</p>

            <p><strong>🏢 Business Name:</strong> ${selectedJob.businessName}</p>

            <p><strong>Employer Name:</strong> ${selectedJob.employerName}</p>

            <p><strong>Posted Date:</strong> ${selectedJob.postedDate}</p>

            <p><strong>Job Status:</strong> ${selectedJob.status}</p>

            <button class="apply-btn" id="detailsApplyBtn" data-job-id="${selectedJob.id}">Apply Now</button>

        `;

        // Apply for Job from Details Page

const detailsApplyBtn = document.getElementById("detailsApplyBtn");

if (detailsApplyBtn) {

    detailsApplyBtn.addEventListener("click", function() {

        // Check logged-in user
        if (!currentUser || currentUser.role !== "worker") {

            showNotification("Please log in as a worker to apply.", "error");

            return;
        }

        // Get existing applications
        const applications = JSON.parse(
            localStorage.getItem("workConnectApplications")
        ) || [];

        // Prevent duplicate applications
        const alreadyApplied = applications.some(function(application) {

            return application.jobId === selectedJob.id &&
                   application.workerPhone === currentUser.phone;

        });

        if (alreadyApplied) {

            showNotification("You have already applied for this job!", "error");

            return;
        }

        // Create new application
        const newApplication = {

            id: Date.now(),
            jobId: selectedJob.id,
            workerName: currentUser.name,
            workerPhone: currentUser.phone,
            workerSkill: currentUser.skill,
            employerPhone: selectedJob.employerPhone,
            jobTitle: selectedJob.title,
            businessName: selectedJob.businessName,
            status: "Pending",
            appliedDate: new Date().toLocaleDateString()

        };

        // Save application
        applications.push(newApplication);

        localStorage.setItem(
            "workConnectApplications",
            JSON.stringify(applications)
        );

        showNotification("Application submitted successfully!", "success");

    });

}

    } else {

        jobDetailsContainer.innerHTML = `
            <h3>Job Not Found!</h3>
            <p>This job may have been removed or does not exist.</p>
        `;

    }

}

// Step 17.2 - View Applications for Specific Job

if (employerJobsContainer && employerApplicationsContainer) {

    employerJobsContainer.addEventListener("click", function(event) {

        if (event.target.classList.contains("view-applications-btn")) {

            const jobId = Number(event.target.dataset.jobId);

            // Get logged-in employer

            const employer = JSON.parse(
                localStorage.getItem("loggedInUser")
            );

            // Get all applications

            const applications = JSON.parse(
                localStorage.getItem("workConnectApplications")
            ) || [];

            // Filter applications for selected job

            const jobApplications = applications.filter(function(application) {

                return application.jobId === jobId &&
                       application.employerPhone === employer.phone;

            });

            // Display applications

            employerApplicationsContainer.innerHTML = "";

            if (jobApplications.length === 0) {

                employerApplicationsContainer.innerHTML =
                    "<p>No applications received for this job yet.</p>";

            } else {

                jobApplications.forEach(function(application) {

                    employerApplicationsContainer.innerHTML += `

                        <div class="job-card">

                            <h3>${application.workerName}</h3>

                            <p><strong>Job:</strong> ${application.jobTitle}</p>

                            <p><strong>Mobile:</strong> ${application.workerPhone}</p>

                            <p><strong>Skill:</strong> ${application.workerSkill}</p>

                            <p><strong>Applied Date:</strong> ${application.appliedDate}</p>

                            <p><strong>Status:</strong> ${application.status}</p>

                            <div class="application-actions">

                                <button class="accept-btn" data-id="${application.id}">
                                    Accept
                                </button>

                                <button class="reject-btn" data-id="${application.id}">
                                    Reject
                                </button>

                            </div>

                        </div>

                    `;

                });

            }

            // Scroll to applications section

            employerApplicationsContainer.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}

// Step 20.4 - Display Worker Notifications

const workerNotificationContainer =
    document.getElementById("workerNotifications");

if (workerNotificationContainer) {

    // Get logged-in worker

    const loggedInWorkerForNotifications = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (
        loggedInWorkerForNotifications &&
        loggedInWorkerForNotifications.role === "worker"
    ) {

        // Get all notifications

        const notifications = JSON.parse(
            localStorage.getItem("workConnectNotifications")
        ) || [];

        // Filter notifications for logged-in worker

        const workerNotifications = notifications.filter(function(notification) {
            return notification.workerPhone ===
                loggedInWorkerForNotifications.phone;
        });

        // Calculate unread notifications

        const unreadCount = workerNotifications.filter(function(notification) {
            return notification.read === false;
        }).length;

        // Update Sidebar Notification Badge

const notificationBadge = document.getElementById("notificationBadge");

if (notificationBadge) {

    if (unreadCount > 0) {

        notificationBadge.textContent = unreadCount;
        notificationBadge.classList.remove("hidden");

    } else {

        notificationBadge.classList.add("hidden");

    }

}

        // Display unread count

        document.getElementById("unreadNotificationCount").textContent =
            `(${unreadCount})`;

        // Mark worker notifications as read

        workerNotifications.forEach(function(notification) {

            notification.read = true;

        });

        // Save updated notifications

        localStorage.setItem(
            "workConnectNotifications",
            JSON.stringify(notifications)
        );

        workerNotificationContainer.innerHTML = "";

        // Check notifications

        if (workerNotifications.length === 0) {

            workerNotificationContainer.innerHTML = `
                <div class="empty-state">
                <h3>You're All Caught Up!</h3>
                <p>No notifications right now.</p>
                </div>
            `;

       } else {

            workerNotifications.forEach(function(notification) {

    workerNotificationContainer.innerHTML += `

        <div class="notification-card ${notification.read ? "read-notification" : "unread-notification"}">

            <h3>🔔 Application Update</h3>

            <p>${notification.message}</p>

            <p><strong>Date:</strong> ${notification.date}</p>

            <p><strong>Status:</strong> ${notification.status}</p>

            <span class="notification-label">
                ${notification.read ? "Read" : "Unread"}
            </span>

        </div>

    `;

});

        }

    }

}

// Worker Sidebar Active Link

const workerSidebarLinks22 = document.querySelectorAll(
    ".sidebar ul li a"
);

if (
    workerSidebarLinks22.length > 0 &&
    document.getElementById("dashboardSection")
) {

    workerSidebarLinks22.forEach(function (link) {

        link.addEventListener("click", function () {

            document.querySelectorAll(".sidebar ul li").forEach(function (item) {
                item.classList.remove("active");
            });

            link.parentElement.classList.add("active");

        });

    });

}