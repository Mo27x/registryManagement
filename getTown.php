<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "anagrafica";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT codiceCatastale, nome, cap.cap FROM comuni, cap WHERE codiceCatastale = cap.codiceCatastaleComune";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $comuni= [];
    while ($obj = $result->fetch_object()) {
      array_push($comuni, $obj);
    }
    print json_encode($comuni);
} else {
  echo "0 results";
}
$conn->close();
?>