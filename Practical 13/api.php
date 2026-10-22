
<?php
header("Content-Type: application/json; charset=UTF-8");

require "db.php";

function respond($success, $message, $data = null, $status = 200) {
    http_response_code($status);

    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ]);

    exit;
}

function getInput() {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
        respond(false, "Invalid JSON input.", null, 400);
    }

    return $input;
}

function validateEvent($input) {
    $title = trim($input["title"] ?? "");

    if ($title === "" || strlen($title) > 150) {
        respond(false, "Title is required (maximum 150 characters).", null, 400);
    }

    $date = trim($input["event_date"] ?? "");
    $description = trim($input["description"] ?? "");
    $category = trim($input["category"] ?? "");
    $status = $input["status"] ?? "Open";

    if ($date !== "") {
        $parsedDate = DateTime::createFromFormat("!Y-m-d", $date);

        if (!$parsedDate || $parsedDate->format("Y-m-d") !== $date) {
            respond(false, "Enter a valid event date.", null, 400);
        }
    } else {
        $date = null;
    }

    if (strlen($description) > 255 || strlen($category) > 80) {
        respond(false, "Description or category is too long.", null, 400);
    }

    if (!in_array($status, ["Open", "Closed"], true)) {
        respond(false, "Status must be Open or Closed.", null, 400);
    }

    return [
        $title,
        $date,
        $description === "" ? null : $description,
        $category === "" ? null : $category,
        $status
    ];
}

$method = $_SERVER["REQUEST_METHOD"];

try {
    // READ: GET all events
    if ($method === "GET") {
        $result = $conn->query(
            "SELECT event_id, title, event_date, description,
                    category, status, poster
             FROM events ORDER BY event_id DESC"
        );

        $events = [];

        while ($row = $result->fetch_assoc()) {
            $events[] = $row;
        }

        respond(true, "Events loaded successfully.", $events);
    }

    // ADD: POST a new event
    if ($method === "POST") {
        $input = getInput();
        [$title, $date, $description, $category, $status] =
            validateEvent($input);

        $stmt = $conn->prepare(
            "INSERT INTO events
             (title, event_date, description, category, status)
             VALUES (?, ?, ?, ?, ?)"
        );

        $stmt->bind_param(
            "sssss",
            $title, $date, $description, $category, $status
        );

        $stmt->execute();
        $id = $conn->insert_id;
        $stmt->close();

        respond(true, "Event added successfully.", ["event_id" => $id], 201);
    }

    // UPDATE: PUT an existing event
    if ($method === "PUT") {
        $input = getInput();
        $id = filter_var($input["event_id"] ?? null, FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            respond(false, "A valid event ID is required.", null, 400);
        }

        [$title, $date, $description, $category, $status] =
            validateEvent($input);

        $stmt = $conn->prepare(
            "UPDATE events
             SET title = ?, event_date = ?, description = ?,
                 category = ?, status = ?
             WHERE event_id = ?"
        );

        $stmt->bind_param(
            "sssssi",
            $title, $date, $description, $category, $status, $id
        );

        $stmt->execute();
        $found = $stmt->affected_rows;
        $stmt->close();

        if ($found === 0) {
            $check = $conn->prepare(
                "SELECT event_id FROM events WHERE event_id = ?"
            );
            $check->bind_param("i", $id);
            $check->execute();
            $check->store_result();
            $exists = $check->num_rows > 0;
            $check->close();

            if (!$exists) {
                respond(false, "Event not found.", null, 404);
            }
        }

        respond(true, "Event updated successfully.", ["event_id" => $id]);
    }

    // DELETE: delete an event
    if ($method === "DELETE") {
        $input = getInput();
        $id = filter_var($input["event_id"] ?? null, FILTER_VALIDATE_INT);

        if (!$id || $id < 1) {
            respond(false, "A valid event ID is required.", null, 400);
        }

        $stmt = $conn->prepare(
            "DELETE FROM events WHERE event_id = ?"
        );
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $deleted = $stmt->affected_rows;
        $stmt->close();

        if ($deleted === 0) {
            respond(false, "Event not found.", null, 404);
        }

        respond(true, "Event deleted successfully.");
    }

    header("Allow: GET, POST, PUT, DELETE");
    respond(false, "Method not allowed.", null, 405);

} catch (Throwable $e) {
    respond(false, "A server error occurred. Please try again.", null, 500);
}
?>
