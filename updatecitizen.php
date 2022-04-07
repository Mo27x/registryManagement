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

$sql = "UPDATE
`cittadini`
SET
`partitaIva` = '[value-5]',
`via` = '[value-6]',
`civico` = '[value-7]',
WHERE
cf = ''";
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