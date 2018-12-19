<?php
include_once 'database.php';

if (!isset($_SESSION['user'])) {
  header("Location: login.php");
  exit;
}

$con=new mysqli($db_servername, $db_username, $db_password, $db_name);

if (mysqli_connect_errno()) {
  echo 'Failed to connect to MySQL:' . mysqli_connect_error();
}

$sql = "SELECT * FROM tbl_events";
if ($_POST['orderBy'] == "event_name") {
  $sql = "SELECT * FROM tbl_events ORDER BY event_name ASC";
}
else if ($_POST['orderBy'] == "event_location") {
  $sql = "SELECT * FROM tbl_events ORDER BY event_location ASC";
}
else if ($_POST['orderBy'] == "event_date") {
  $sql = "SELECT * FROM tbl_events ORDER BY event_date ASC";
}

$result = mysqli_query($con, $sql);
if (!$result) {
  print(mysqli_error($con));
}

$con->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <link rel="stylesheet" type="text/css" href="style.css">
  <title>Events</title>
</head>

<body>
  <nav class="nav">
    <div>
      <ul class="navbar-nav">
        <li><a href="events.php"><b>Events Page</b></a></li>
        <li><a href="logout.php"> <b><span class="glyphicon glyphicon-log-out"></span> </b> </a></li>
      </ul>
      <p id="usersName">Welcome <?php print($_SESSION['user']) ?>!</p>
    </div>
  </nav>
  
  <div class="container">
    <table class="table" id="calendarTable">
      <thead>
        <tr></tr>
        <tr>
          <th scope="col">Event Name</th>
          <th scope="col">Location</th>
          <th scope="col">Date</th>
        </tr>
      </thead>
      <tbody>
        <?php
          while($row = mysqli_fetch_row($result)) {
            print("<tr>");
            print("<td>$row[1]</td>");
            print("<td>$row[2]</td>");
            print("<td>$row[3]</td>");
            print("</tr>");
          }
        ?>
      </tbody>
    </table>
    
    
    <form method='POST' action = <?php echo $_SERVER['PHP_SELF'] ?>>
      <table class="table">
        <tbody>
          <tr>
            <td><input type="radio" id="event_name" name="orderBy" value="event_name" style="width: auto;"><b> event name</b></td>
			<td><input type="radio" id="event_location" name="orderBy" value="event_location" style="width: auto;"><b> event location</b></td>
			<td><input type="radio" id="event_date" name="orderBy" value="event_date" style="width: auto;"><b> event date</b></td>
          <tr>
        </tbody>
      </table>
    </form>
    
    <script>
      $('#event_name, #event_location, #event_date').on('input', function() {
          var getOrderBy;
          var radios = document.getElementsByName('orderBy');
          for (var i = 0; i < radios.length; i++){
          	if (radios[i].checked)
          	{
          		getOrderBy = radios[i].value;
          		break;
          	}
          }
          $.ajax({
            url: 'events.php',
            type: 'POST',
            data: { orderBy: getOrderBy },
            success: function(data) {
              var result = $(data).find('table').html();
              document.getElementById("calendarTable").innerHTML = '<tbody>' + result + '<tbody/>';
            }
          });
      });    
    </script>
  </div>
</body>

</html>