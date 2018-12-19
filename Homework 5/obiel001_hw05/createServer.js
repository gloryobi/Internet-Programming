
const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

http.createServer(function (req, res) {
  if (req.method === 'GET'){
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    if(req.url === '/'){
      indexPage(req,res);
    }
    else if(req.url === '/index.html'){
      indexPage(req,res);
    }
    else if(req.url === '/calendar.html'){
      calendarPage(req,res);
    }
    else if(req.url === '/addCalendar.html'){
      addCalendarPage(req,res);
    }
    else if(req.url === '/getCalendar'){
      getCalendarEvents(req,res);
    }
    else{
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
  }
  else if (req.method === 'POST'){
    if(req.url === '/postCalendarEntry'){
      var requestData = '';
      req.on('data', function(data) {
        requestData += data;
      });
      req.on('end', function() {
        addCalendarEvents(req, res, requestData);
      });
    }
  }
}).listen(9000);


function indexPage(req, res) {
  fs.readFile('client/index.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function calendarPage(req, res) {
  fs.readFile('client/calendar.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function addCalendarPage(req, res) {
  fs.readFile('client/addCalendar.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}

function getCalendarEvents(req, res) {
  fs.readFile('calendar.json', function(err, json) {
    if(err) {
      throw err;
    }
    parseJson = JSON.parse(json);
    var result = {res: parseJson};
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(result));
    res.end();
  });
}

function addCalendarEvents(req, res, requestData) {
  fs.readFile('calendar.json', function(err, json) {
    if(err) {
      throw err;
    }
    parseJson = JSON.parse(json);
    var reqData = qs.parse(requestData);
    parseJson.calendar.push( {
      "eventName": reqData.eventName,
      "location": reqData.location,
      "date": reqData.date
    });
    fs.writeFile('calendar.json', JSON.stringify(parseJson, null, "\t"), "UTF-8", function(err, parseJson) {
      if(err) {
        throw err;
      }
    });
    res.statusCode = 302;
    res.setHeader('Location', 'calendar.html');
    res.end();
  });
}