<?php
session_start();
$xml=simplexml_load_file("dbconfig.xml") or die("Error creating object");
$db_servername = $xml-> host;
$db_username = $xml->user;
$db_password = $xml->password;
$db_name = $xml->database;
$db_port = $xml->port;

?>