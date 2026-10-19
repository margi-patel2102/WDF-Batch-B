
<?php
require_once "db.php";
$message = "";

// DELETE STUDENT
if (isset($_POST["delete"])) {
    $id = (int)$_POST["student_id"];

    $stmt = $conn->prepare(
        "DELETE FROM students WHERE student_id=?"
    );
    $stmt->bind_param("i", $id);
    $stmt->execute();

    header("Location: students.php");
    exit;
}

// ADD OR UPDATE STUDENT
if (isset($_POST["save"])) {
    $id = (int)($_POST["student_id"] ?? 0);
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $course = trim($_POST["course"]);

    if ($name !== "" &&
        filter_var($email, FILTER_VALIDATE_EMAIL) &&
        $course !== "") {

        if ($id > 0) {
            $stmt = $conn->prepare(
                "UPDATE students
                 SET name=?, email=?, course=?
                 WHERE student_id=?"
            );
            $stmt->bind_param("sssi", $name, $email, $course, $id);
        } else {
            $stmt = $conn->prepare(
                "INSERT INTO students (name, email, course)
                 VALUES (?, ?, ?)"
            );
            $stmt->bind_param("sss", $name, $email, $course);
        }

        $stmt->execute();
        header("Location: students.php");
        exit;
    } else {
        $message = "Please enter valid details in all fields.";
    }
}

// EDIT STUDENT
$edit = null;

if (isset($_GET["edit"])) {
    $id = (int)$_GET["edit"];

    $stmt = $conn->prepare(
        "SELECT * FROM students WHERE student_id=?"
    );
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $edit = $stmt->get_result()->fetch_assoc();
}

// SEARCH AND DISPLAY STUDENTS
$search = trim($_GET["search"] ?? "");
$term = "%" . $search . "%";

$stmt = $conn->prepare(
    "SELECT * FROM students
     WHERE name LIKE ? OR email LIKE ? OR course LIKE ?
     ORDER BY student_id DESC"
);

$stmt->bind_param("sss", $term, $term, $term);
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html>
<head>
    <title>StudentHub - Student Management</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 30px;
            background: #f5f2fa;
        }

        h1 { color: #7041a6; }

        input {
            padding: 9px;
            margin: 4px;
        }

        button {
            padding: 9px;
            background: #8e5ac7;
            color: white;
            border: none;
            cursor: pointer;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            background: white;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }

        th {
            background: #8e5ac7;
            color: white;
        }

        a { color: #7041a6; }
    </style>
</head>

<body>

<h1>StudentHub - Student Management</h1>

<h3><?= $edit ? "Edit Student" : "Add Student" ?></h3>

<?php if ($message !== ""): ?>
    <p><?= htmlspecialchars($message) ?></p>
<?php endif; ?>

<form method="post">
    <input type="hidden" name="student_id"
        value="<?= (int)($edit["student_id"] ?? 0) ?>">

    <input name="name" placeholder="Student Name" required
        value="<?= htmlspecialchars($edit["name"] ?? "") ?>">

    <input type="email" name="email" placeholder="Email" required
        value="<?= htmlspecialchars($edit["email"] ?? "") ?>">

    <input name="course" placeholder="Course" required
        value="<?= htmlspecialchars($edit["course"] ?? "") ?>">

    <button type="submit" name="save">Save Student</button>
</form>

<h3>Search Students</h3>

<form method="get">
    <input name="search" placeholder="Search name, email or course"
        value="<?= htmlspecialchars($search) ?>">

    <button type="submit">Search</button>
    <a href="students.php">Show All</a>
</form>

<table>
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Course</th>
        <th>Actions</th>
    </tr>

    <?php while ($row = $result->fetch_assoc()): ?>
    <tr>
        <td><?= (int)$row["student_id"] ?></td>

        <td><?= htmlspecialchars($row["name"]) ?></td>

        <td><?= htmlspecialchars($row["email"]) ?></td>

        <td><?= htmlspecialchars($row["course"]) ?></td>

        <td>
            <a href="?edit=<?= (int)$row["student_id"] ?>">Edit</a>

            <form method="post" style="display:inline"
                onsubmit="return confirm('Delete this student?')">

                <input type="hidden" name="student_id"
                    value="<?= (int)$row["student_id"] ?>">

                <button type="submit" name="delete">Delete</button>
            </form>
        </td>
    </tr>
    <?php endwhile; ?>
</table>

</body>
</html>
