<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "calendar_db";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['month']) && isset($_GET['year'])) {
    $month = $_GET['month']; 
    $year = $_GET['year'];   

    
    $sql = "SELECT * FROM events WHERE MONTH(event_date) = ? AND YEAR(event_date) = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $month, $year);
    $stmt->execute();
    $result = $stmt->get_result();

    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }


    if (empty($events)) {
        echo json_encode(["message" => "No events found for this month."]);
    } else {
        echo json_encode($events);
    }
} else {
    echo json_encode(["error" => "Month and year are required."]);
}

$conn->close();

