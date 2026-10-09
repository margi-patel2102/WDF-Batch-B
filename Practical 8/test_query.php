
<?php
require "db.php";

$sql = "SELECT * FROM students WHERE email = :email";
$stmt = $pdo->prepare($sql);

$stmt->execute([
    "email" => "25dit058@charusat.edu.in"
]);

$student = $stmt->fetch(PDO::FETCH_ASSOC);

if ($student) {
    echo "Student found: " . htmlspecialchars($student["name"]);
} else {
    echo "Student not found. Add a student record first.";
}
?>