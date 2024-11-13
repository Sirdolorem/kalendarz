<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $date = $_POST['date']; 
    $title = $_POST['event_title']; 
    $description = $_POST['event_description']; 


    $sql = "INSERT INTO events (event_date, event_title, event_description) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $date, $title, $description);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Event created successfully."]);
        header("Location: index.html");
    } else {
        echo json_encode(["success" => false, "message" => "Failed to create event."]);
        header("Location: index.html");
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    header("Location: index.html");
}

$conn->close();

