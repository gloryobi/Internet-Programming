"use strict";

(function() {
  // the API end point
  var url = "getListOfEvents";
  var data;
  $.ajax({
      url: url,
      data: data,
      success: function(data) {
          display(data);
      }
  });

  function display(data) {
    var events = data;
    var tableBody = document.getElementsByTagName("tbody");
    for (var i = 0; i < events.length; i++) {
      var tableRow = document.createElement("tr");
      tableRow.setAttribute("style", "border-top: solid 1px grey; text-align: center;");
      for (var j in events[i]) {
        if(j !== "event_id") {
          var tableData = document.createElement("td");
          tableData.innerHTML = events[i][j];
          tableRow.appendChild(tableData);
        }
      }
      tableBody[0].appendChild(tableRow);
    }
  }
})();