const form = document.getElementById("signupForm");


// ===============================
// Password Strength
// ===============================

const passwordInput = document.getElementById("password");
const strength = document.getElementById("passwordStrength");

passwordInput.addEventListener("input", function () {

    let password = passwordInput.value;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (password.length === 0) {
        strength.textContent = "";
    }
    else if (score <= 2) {
        strength.textContent = "Weak password";
    }
    else if (score <= 4) {
        strength.textContent = "Medium password";
    }
    else {
        strength.textContent = "Strong password";
    }
});


// ===============================
// Form Validation
// ===============================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    let valid = true;


    // Get values

    let name = document.getElementById("name").value.trim();

    let email = document.getElementById("email").value.trim();

    let studentId = document.getElementById("studentId").value.trim();

    let username = document.getElementById("username").value.trim();

    let mobile = document.getElementById("mobile").value.trim();

    let password = document.getElementById("password").value;

    let confirmPassword =
        document.getElementById("confirmPassword").value;

    let course = document.getElementById("course").value;

    let year = document.getElementById("year").value;

    let terms = document.getElementById("terms").checked;


    // ===============================
    // Regular Expressions
    // ===============================

    let namePattern = /^[A-Za-z ]+$/;

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let mobilePattern = /^[0-9]{10}$/;

    let usernamePattern = /^[A-Za-z0-9_]{3,15}$/;


    // ===============================
    // Clear Previous Errors
    // ===============================

    document.querySelectorAll("small").forEach(function (error) {

        error.textContent = "";

    });


    // ===============================
    // Name Validation
    // ===============================

    if (name === "") {

        document.getElementById("nameError").textContent =
            "Please enter your name.";

        valid = false;

    }
    else if (!namePattern.test(name)) {

        document.getElementById("nameError").textContent =
            "Name should contain only letters.";

        valid = false;

    }


    // ===============================
    // Email Validation
    // ===============================

    if (email === "") {

        document.getElementById("emailError").textContent =
            "Please enter your email.";

        valid = false;

    }
    else if (!emailPattern.test(email)) {

        document.getElementById("emailError").textContent =
            "Please enter a valid email address.";

        valid = false;

    }


    // ===============================
    // Student ID Validation
    // ===============================

    if (studentId === "") {

        document.getElementById("studentIdError").textContent =
            "Please enter your student ID.";

        valid = false;

    }


    // ===============================
    // Username Validation
    // ===============================

    if (username === "") {

        document.getElementById("usernameError").textContent =
            "Please create a username.";

        valid = false;

    }
    else if (!usernamePattern.test(username)) {

        document.getElementById("usernameError").textContent =
            "Username must be 3-15 characters.";

        valid = false;

    }


    // ===============================
    // Mobile Validation
    // ===============================

    if (mobile === "") {

        document.getElementById("mobileError").textContent =
            "Please enter your mobile number.";

        valid = false;

    }
    else if (!mobilePattern.test(mobile)) {

        document.getElementById("mobileError").textContent =
            "Mobile number must contain 10 digits.";

        valid = false;

    }


    // ===============================
    // Password Validation
    // ===============================

    if (password === "") {

        document.getElementById("passwordError").textContent =
            "Please enter a password.";

        valid = false;

    }
    else if (password.length < 8) {

        document.getElementById("passwordError").textContent =
            "Password must be at least 8 characters.";

        valid = false;

    }


    // ===============================
    // Confirm Password
    // ===============================

    if (confirmPassword === "") {

        document.getElementById("confirmPasswordError").textContent =
            "Please confirm your password.";

        valid = false;

    }
    else if (password !== confirmPassword) {

        document.getElementById("confirmPasswordError").textContent =
            "Passwords do not match.";

        valid = false;

    }


    // ===============================
    // Course Validation
    // ===============================

    if (course === "") {

        document.getElementById("courseError").textContent =
            "Please select your course.";

        valid = false;

    }


    // ===============================
    // Year Validation
    // ===============================

    if (year === "") {

        document.getElementById("yearError").textContent =
            "Please select your year.";

        valid = false;

    }


    // ===============================
    // Gender Validation
    // ===============================

    let gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!gender) {

        document.getElementById("genderError").textContent =
            "Please select your gender.";

        valid = false;

    }


    // ===============================
    // Terms Validation
    // ===============================

    if (!terms) {

        document.getElementById("termsError").textContent =
            "Please accept the Terms & Conditions.";

        valid = false;

    }


    // ===============================
    // Final Result
    // ===============================

    if (valid) {

        alert("Registration successful!");

        form.reset();

        strength.textContent = "";

    }

});
