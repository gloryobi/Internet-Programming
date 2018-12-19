<?php
error_reporting(E_ALL); 
ini_set( 'display_errors','1');
include_once 'database.php'; 
$con=new mysqli($db_servername, $db_username, $db_password, $db_name);
// Check connection
if (mysqli_connect_errno())
  {
  echo 'Failed to connect to MySQL:' . mysqli_connect_error();
  }

function getDateForDatabase($date) {
    $timestamp = strtotime($date);
    $date_formated = date('H:i:s', $timestamp);
    return $date_formated;
}
 
$sql1 = "INSERT INTO tbl_events (event_name, event_location, event_date) VALUES ('CSCI 3123','Keller Hall 320','".getDateForDatabase('00:00:00')."');";
mysqli_query($con,$sql1);
echo "Row 1 inserted<br>";

$sql2 = "INSERT INTO tbl_events (event_name, event_location, event_date) VALUES ('Meeting','Shepherd Labs 587','".getDateForDatabase('01:00:00')."');";
mysqli_query($con,$sql2);
echo "Row 2 inserted<br>";

$sql3 = "INSERT INTO tbl_events (event_name, event_location, event_date) VALUES ('Bowling ','Coffman','".getDateForDatabase('02:00:00')."');";
mysqli_query($con,$sql3);
echo "Row 3 inserted<br>";

$sql4 = "INSERT INTO tbl_events (event_name, event_location, event_date) VALUES ('CSCI 2034','Keller Hall 322','".getDateForDatabase('03:00:00')."');";
mysqli_query($con,$sql4);
echo "Row 4 inserted<br>";

$sql5 = "INSERT INTO tbl_events (event_name, event_location, event_date) VALUES ('Group Meeting ','Walter Library','".getDateForDatabase('04:00:00')."');";
mysqli_query($con,$sql5);
echo "Row 5 inserted<br>";
  

echo '<h1> Successfully Inserted Values into the Table </h1>'
?> 