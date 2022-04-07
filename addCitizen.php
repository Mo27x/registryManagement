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

if ($_SERVER["REQUEST_METHOD"] == "POST") {

}

$cf = $_POST['fiscalCode'];
$nome = $_POST['fname'];
$cognome = $_POST['lname'];
$sesso = $_POST['gender'];
$dataNascita = $_POST['dateOfBirth'];
$partitaIva = $_POST['vatNumber'];
$via = $_POST['street'];
$civico = $_POST['houseNumber'];
$codiceCatastaleNascita = $_POST['birthPlaceCadastralCode'];
$codiceCatastaleResidenza = $_POST['residencePlaceCadastralCode'];

$date = strtotime($dataNascita);
$dataNascita = date('Y-m-d H:i:s', $date);

$sql = "INSERT INTO cittadini(
  cf,
  nome,
  cognome,
  sesso,
  dataNascita,
  partitaIva,
  via,
  civico,
  codiceCatastaleNascita,
  codiceCatastaleResidenza
)
VALUES(
  '".$cf."',
  '".$nome."',
  '".$cognome."',
  '".$sesso."',
  '".$dataNascita."',
  '".$partitaIva."',
  '".$via."',
  '".$civico."',
  '".$codiceCatastaleNascita."',
  '".$codiceCatastaleResidenza."'
)";
echo $sql;
if ($conn->query($sql) === TRUE) {
  print 'User added';
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>