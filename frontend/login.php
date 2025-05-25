<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Set the correct username and password
$valid_username = "dishrated";
$valid_password = "123";

// Get JSON data from React
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if ($username === $valid_username && $password === $valid_password) {
    echo json_encode(["status" => "success", "message" => "Login successful"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
}
?>
