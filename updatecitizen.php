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
civico = '".$_POST['houseNumber']."',
WHERE
cf = '".$_POST['fiscalCode']."'";
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