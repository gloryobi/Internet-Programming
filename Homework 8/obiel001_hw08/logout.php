<?php
include_once 'database.php';
session_destroy();
header("Location: login.php"); 
?>