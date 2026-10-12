
<?php
require_once "db.php";

$message = "";
$messageType = "";

$name = "";
$email = "";
$username = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST["name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $username = trim($_POST["username"] ?? "");
    $password = $_POST["password"] ?? "";
    $confirmPassword = $_POST["confirm_password"] ?? "";

    if ($name === "" || $email === "" ||
        $username === "" || $password === "" ||
        $confirmPassword === "") {

        $message = "All fields are required.";
        $messageType = "error";

    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = "Please enter a valid email address.";
        $messageType = "error";

    } elseif (!preg_match("/^[a-zA-Z0-9_]{3,20}$/", $username)) {
        $message = "Username must be 3-20 characters and contain only letters, numbers, or underscores.";
        $messageType = "error";

    } elseif (strlen($password) < 8) {
        $message = "Password must be at least 8 characters.";
        $messageType = "error";

    } elseif ($password !== $confirmPassword) {
        $message = "Passwords do not match.";
        $messageType = "error";

    } else {
        $stmt = $conn->prepare(
            "SELECT id FROM users WHERE email = ? OR username = ?"
        );
        $stmt->bind_param("ss", $email, $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $message = "Email or username already exists.";
            $messageType = "error";
            $stmt->close();

        } else {
            $stmt->close();

            $hashedPassword = password_hash(
                $password,
                PASSWORD_DEFAULT
            );

            $stmt = $conn->prepare(
                "INSERT INTO users (name, email, username, password)
                 VALUES (?, ?, ?, ?)"
            );
            $stmt->bind_param(
                "ssss",
                $name,
                $email,
                $username,
                $hashedPassword
            );

            if ($stmt->execute()) {
                $message = "Registration successful!";
                $messageType = "success";

                $name = "";
                $email = "";
                $username = "";
            } else {
                if ($stmt->errno === 1062) {
                    $message = "Email or username already exists.";
                } else {
                    $message = "Registration failed. Please try again.";
                }
                $messageType = "error";
            }

            $stmt->close();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Secure Registration</title>
    <link rel="stylesheet" href="register.css">
</head>
<body>

<div class="container">
    <h2>StudentHub Registration</h2>
    <p class="subtitle">Create your account</p>

    <?php if ($message !== ""): ?>
        <div class="message <?= htmlspecialchars($messageType) ?>">
            <?= htmlspecialchars($message) ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="" id="registerForm">
        <label for="name">Full Name</label>
        <input type="text" id="name" name="name"
            value="<?= htmlspecialchars($name) ?>"
            maxlength="100" required>

        <label for="email">Email</label>
        <input type="email" id="email" name="email"
            value="<?= htmlspecialchars($email) ?>"
            maxlength="100" required>

        <label for="username">Username</label>
        <input type="text" id="username" name="username"
            value="<?= htmlspecialchars($username) ?>"
            minlength="3" maxlength="20"
            pattern="[a-zA-Z0-9_]{3,20}" required>

        <label for="password">Password</label>
        <input type="password" id="password" name="password"
            minlength="8" required>

        <label for="confirm_password">Confirm Password</label>
        <input type="password" id="confirm_password"
            name="confirm_password" minlength="8" required>

        <button type="submit">Register</button>
    </form>

    <p class="footer">Already registered? Try a different username.</p>
</div>

<script>
document.getElementById("registerForm").addEventListener("submit", function(e) {
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirm_password").value;

    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        e.preventDefault();
    } else if (password !== confirmPassword) {
        alert("Passwords do not match.");
        e.preventDefault();
    }
});
</script>

</body>
</html>
