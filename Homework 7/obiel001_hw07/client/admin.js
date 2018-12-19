var editButton = "<a class='btn-group editButton'>" + "<span class='glyphicon glyphicon-pencil'></a>";
var cancelButton = "<a class='cancelButton'>" + "<span class='glyphicon glyphicon-remove'><span></a>";
var saveButton = "<a class='saveButton'>" + "<span class='glyphicon glyphicon-floppy-save'><span></a>";
var deleteButton = "<a class='deleteButton'>" + "<span><span class='glyphicon glyphicon-trash'><span></a>";

(function() {
  // the API end point
  var url = "getUserList";
  var data;
  $.ajax({
    url: url,
    data: data,
    success: function(data) {
      for (var user in data) {
        //if (data[usr].acc_login === 'alpha') { continue; }
        $("#usersTable").append(
          "<tr>" +
          "<td>" + data[user].acc_id + "</td>" +
          "<td>" + data[user].acc_name + "</td>" +
          "<td>" + data[user].acc_login + "</td>" +
          "<td></td>" +
          "<td style='text-align: center;'>" + editButton + "   " + deleteButton + "</td>" +
          "</tr>");

        $(".editButton").bind("click", editUser);
        $(".deleteButton").bind("click", deleteUser);
      }
    }
  });
})();

function clearErrorMsg() {
  $('#errorMsg').text('');
}

function addUser() {
  clearErrorMsg();
  $("#usersTable").append(
    "<tr id='newUserRow'>" +
    '<td></td>' +
    "<td><input type='text' id='user-name'/></td>" +
    "<td><input type='text' id='user-login'/></td>" +
    "<td><input type='text' id='user-pass'/></td>" +
    "<td style='text-align: center; vertical-align: middle;'>" + saveButton + "   " + cancelButton + "</td>" +
    "</tr>");

  $(".saveButton").bind("click", saveNewUser);
  $(".cancelButton").bind("click", cancelNewUser);
};

function saveNewUser() {
  clearErrorMsg();
  $.ajax({
    type: 'POST',
    url: '/save',
    data: { name: $('#user-name').val(), login: $('#user-login').val(), password: $('#user-pass').val() },
    success: function (data, textStatus, jqXHR) {
      window.location.reload();
    },
    error: function (jqXHR, textStatus, errorThrown) {
	    $("#errorMsg").html("<span style='color: red;'> This login is used by another user </span>");
    }
  });
}

function cancelNewUser() {
  clearErrorMsg();
  var row = document.getElementById('newUserRow');
  if (row) {
    row.remove();
  }
}

function deleteUser() {
  clearErrorMsg();
  var userRow = this.parentElement.parentElement;
  var login = userRow.childNodes[2].innerHTML;
  $.ajax({
    type: 'DELETE',
    url: '/delete',
    data: { login: login },
    success: function (data, textStatus, jqXHR) {
      window.location.reload();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#errorMsg").html("<span style='color: red;'> Cannot delete the user that is logged in </span>");
    }
  });
}

var oldUserLogin;

function editUser() {
  clearErrorMsg();
  var userRow = this.parentElement.parentElement;
  var userId = userRow.childNodes[0].innerHTML;
  var oldUserName = userRow.childNodes[1].innerHTML;
  oldUserLogin = userRow.childNodes[2].innerHTML;
  
  userRow.childNodes[1].innerHTML = "<input type='text' id='user-name' value='" + oldUserName + "'/>";
  userRow.childNodes[2].innerHTML = "<input type='text' id='user-login' value='" + oldUserLogin + "'/>";
  userRow.childNodes[3].innerHTML = "<input type='text' id='user-pass'/>";
  userRow.childNodes[4].innerHTML = saveButton + "   " + cancelButton;
  
  $(".cancelButton").click(function() {
    window.location.reload();
  });
  $(".saveButton").bind("click", updateUser);
}

function updateUser() {
  clearErrorMsg();
  $.ajax({
    type: 'POST',
    url: '/update',
    data: { name: $('#user-name').val(), login: $('#user-login').val(), oldUserLogin: oldUserLogin, password: $('#user-pass').val() },
    success: function (data, textStatus, jqXHR) {
      window.location.reload();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#errorMsg").html("<span style='color: red;'> This login is used by another user </span>");
    }
  });
}