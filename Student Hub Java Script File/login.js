function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let savedUsername = localStorage.getItem("username");
    let savedPassword = localStorage.getItem("password");

    if (username == "" || password == "") {
        alert("Please enter username and password.");
        return;
    }

    if (username == savedUsername && password == savedPassword) {
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid username or password.");
    }
}

