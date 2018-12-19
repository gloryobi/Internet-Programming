<?php
include_once 'database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $username = $_POST["username"];
  $password = sha1($_POST["password"]);

  $con = new mysqli($db_servername, $db_username, $db_password, $db_name);
  
  if (mysqli_connect_errno()) {
    echo 'Failed to connect to MySQL:' . mysqli_connect_error();
  }
  
  $sql = mysqli_query($con,"SELECT * FROM tbl_accounts WHERE acc_login='$username' AND acc_password='$password'");
  $con->close();
  $row = mysqli_fetch_row($sql);
  
  if (mysqli_num_rows($sql) > 0) {
    $_SESSION['user'] = $row[1];
    mysqli_close($con);
    header("Location: events.php");
    exit();
  }
  else {
    header("Location: login.php");
    $error = "<span style='color: red;'> Invalid credentials. Please try again! </span>";
  }
}
?> 

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <link rel="stylesheet" type="text/css" href="style.css">
  <title>Login</title>
</head>

<body>
  <div class="top">
    <h1>Login Page</h1>
    <p>Please enter your username and password. Both are case sensitive</p>
  </div>
  <p class="errorMsg"><?php
    if(isset($error)) {echo $error;} ?>
  </p>
  
  <form method = 'post' class="frm" id="loginForm" name="login"  style="margin-left: 100px; margin-right: 100px;">
    <div class="log">
      <label> User: </label> <br>
      <input type="text" placeholder="Enter user name" name="username" id="username" required><br>
      <label> Password: </label> <br>
      <input type="password" placeholder="Enter password" name="password" id="password" required><br>
      <button type="submit"> Submit </button>
    </div>
  </form>
</body>

</html>