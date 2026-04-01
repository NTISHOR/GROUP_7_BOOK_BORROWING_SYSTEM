<?php
$host = "localhost";
$user = "root";
$pass = ""; // Set to empty for both your system and the flash drive
$dbname = "g7_bbs"; 

// Create connection
$conn = mysqli_connect($host, $user, $pass, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>