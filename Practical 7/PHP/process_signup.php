<?php

// ======================================
// CHECK REQUEST METHOD
// ======================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo "Invalid request.";

    exit();

}


// ======================================
// GET FORM DATA
// ======================================

$name = trim($_POST["name"] ?? "");

$email = trim($_POST["email"] ?? "");

$studentId = trim($_POST["studentId"] ?? "");

$username = trim($_POST["username"] ?? "");

$mobile = trim($_POST["mobile"] ?? "");

$password = $_POST["password"] ?? "";

$confirmPassword = $_POST["confirmPassword"] ?? "";

$course = trim($_POST["course"] ?? "");

$year = trim($_POST["year"] ?? "");

$gender = trim($_POST["gender"] ?? "");

$terms = $_POST["terms"] ?? "";


// ======================================
// ERROR ARRAY
// ======================================

$errors = [];


// ======================================
// SERVER-SIDE VALIDATION
// ======================================

if ($name === "") {

    $errors[] = "Full name is required.";

}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    $errors[] = "Enter a valid email address.";

}


if ($studentId === "") {

    $errors[] = "Student ID is required.";

}


if ($username === "") {

    $errors[] = "Username is required.";

}


if (!preg_match("/^[0-9]{10}$/", $mobile)) {

    $errors[] =
        "Mobile number must contain 10 digits.";

}


if (strlen($password) < 6) {

    $errors[] =
        "Password must contain at least 6 characters.";

}


if ($password !== $confirmPassword) {

    $errors[] =
        "Passwords do not match.";

}


if ($course === "") {

    $errors[] =
        "Please select a course.";

}


if ($year === "") {

    $errors[] =
        "Please select your year.";

}


if ($gender === "") {

    $errors[] =
        "Please select your gender.";

}


if ($terms === "") {

    $errors[] =
        "You must accept the Terms & Conditions.";

}


// ======================================
// SHOW ERRORS
// ======================================

if (!empty($errors)) {

    echo implode("\n", $errors);

    exit();

}


// ======================================
// SANITIZATION
// ======================================

$name =
    htmlspecialchars($name, ENT_QUOTES, "UTF-8");

$email =
    htmlspecialchars($email, ENT_QUOTES, "UTF-8");

$studentId =
    htmlspecialchars($studentId, ENT_QUOTES, "UTF-8");

$username =
    htmlspecialchars($username, ENT_QUOTES, "UTF-8");

$mobile =
    htmlspecialchars($mobile, ENT_QUOTES, "UTF-8");

$course =
    htmlspecialchars($course, ENT_QUOTES, "UTF-8");

$year =
    htmlspecialchars($year, ENT_QUOTES, "UTF-8");

$gender =
    htmlspecialchars($gender, ENT_QUOTES, "UTF-8");


// ======================================
// CSV FILE
// ======================================

$file = "../data/registrations.csv";


// ======================================
// OPEN FILE
// ======================================

$handle = fopen($file, "a");


if ($handle === false) {

    echo "Unable to open registration file.";

    exit();

}


// ======================================
// ADD HEADER
// ======================================

if (filesize($file) == 0) {

    fputcsv($handle, [

        "Name",
        "Email",
        "Student ID",
        "Username",
        "Mobile",
        "Course",
        "Year",
        "Gender"

    ]);

}


// ======================================
// SAVE STUDENT
// ======================================

fputcsv($handle, [

    $name,
    $email,
    $studentId,
    $username,
    $mobile,
    $course,
    $year,
    $gender

]);


// ======================================
// CLOSE FILE
// ======================================

fclose($handle);


// ======================================
// SEND SUCCESS TO JAVASCRIPT
// ======================================

echo "success";

exit();

?>