function signup() {

    let username = document.getElementById("username").value;
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let studentId = document.getElementById("studentId").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (username == "" || name == "" || email == "" || studentId == "" || password == "" || confirmPassword == "") {
        alert("Please fill all the fields.");
        return;
    }

    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Save username and password
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Account created successfully!");
    window.location.href = "login.html";
}

