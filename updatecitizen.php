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
cittadini
SET
partitaIva = '".$_POST['vatNumber']."',
via = '".$_POST['street']."',
civico = '".$_POST['houseNumber']."'
WHERE
cf = '".$_POST['fiscalCode']."';";
if ($conn->query($sql) === TRUE) {
  echo "Citizen updated successfully";
} else {
  echo "Error updating record: " . $conn->error;
}
$conn->close();
?>