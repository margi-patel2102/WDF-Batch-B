const form = document.getElementById("signupForm");


// =============================
// FORM SUBMIT
// =============================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    let valid = true;


    // Get values

    let name =
        document.getElementById("name").value.trim();

    let email =
        document.getElementById("email").value.trim();

    let studentId =
        document.getElementById("studentId").value.trim();

    let username =
        document.getElementById("username").value.trim();

    let mobile =
        document.getElementById("mobile").value.trim();

    let password =
        document.getElementById("password").value;

    let confirmPassword =
        document.getElementById("confirmPassword").value;

    let course =
        document.getElementById("course").value;

    let year =
        document.getElementById("year").value;

    let terms =
        document.getElementById("terms").checked;


    // =============================
    // REGULAR EXPRESSIONS
    // =============================

    let namePattern =
        /^[A-Za-z ]+$/;

    let emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let mobilePattern =
        /^[0-9]{10}$/;

    let usernamePattern =
        /^[A-Za-z0-9_]{3,15}$/;


    // =============================
    // CLEAR OLD ERRORS
    // =============================

    document
        .querySelectorAll("small")
        .forEach(function (error) {

            error.textContent = "";

        });


    // =============================
    // NAME
    // =============================

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


    // =============================
    // EMAIL
    // =============================

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


    // =============================
    // STUDENT ID
    // =============================

    if (studentId === "") {

        document.getElementById("studentIdError").textContent =
            "Please enter your student ID.";

        valid = false;

    }


    // =============================
    // USERNAME
    // =============================

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


    // =============================
    // MOBILE
    // =============================

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


    // =============================
    // PASSWORD
    // =============================

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


    // =============================
    // CONFIRM PASSWORD
    // =============================

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


    // =============================
    // COURSE
    // =============================

    if (course === "") {

        document.getElementById("courseError").textContent =
            "Please select your course.";

        valid = false;

    }


    // =============================
    // YEAR
    // =============================

    if (year === "") {

        document.getElementById("yearError").textContent =
            "Please select your year.";

        valid = false;

    }


    // =============================
    // GENDER
    // =============================

    let gender =
        document.querySelector(
            'input[name="gender"]:checked'
        );


    if (!gender) {

        document.getElementById("genderError").textContent =
            "Please select your gender.";

        valid = false;

    }


    // =============================
    // TERMS
    // =============================

    if (!terms) {

        document.getElementById("termsError").textContent =
            "Please accept the Terms & Conditions.";

        valid = false;

    }


    // =============================
    // SEND TO PHP
    // =============================

    if (valid) {

        let createButton =
            document.getElementById("createButton");

        createButton.textContent =
            "Creating Account...";

        createButton.classList.add("loading");

        createButton.disabled = true;


        let formData =
            new FormData(form);


        fetch("php/process_signup.php", {

            method: "POST",

            body: formData

        })

        .then(function (response) {

            return response.text();

        })

        .then(function (result) {

            result = result.trim();


            // =============================
            // SUCCESS
            // =============================

            if (result === "success") {

                document
                    .getElementById("successModal")
                    .classList.add("show");

            }


            // =============================
            // PHP ERROR
            // =============================

            else {

                alert(result);

                createButton.textContent =
                    "Create Account";

                createButton.classList.remove("loading");

                createButton.disabled = false;

            }

        })

        .catch(function (error) {

            console.error(error);

            alert(
                "Unable to process registration. " +
                "Please make sure XAMPP Apache is running."
            );

            createButton.textContent =
                "Create Account";

            createButton.classList.remove("loading");

            createButton.disabled = false;

        });

    }

});


// =============================
// CONTINUE TO LOGIN
// =============================

document
    .getElementById("continueButton")
    .addEventListener("click", function () {

        window.location.href = "login.html";

    });