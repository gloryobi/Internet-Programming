//JavaScript Code for calendar.html
function popInImg(x){
	var popImg = document.createElement('p');
	if(x.innerHTML.indexOf("Keller") != -1){
		popImg.innerHTML = "<img src='./keller.jpg' alt='keller.jpg' height='25' width='25'>";
	}
	else if(x.innerHTML.indexOf("Akerman Hall") != -1){
		popImg.innerHTML = "<img src='./akerman.jpg' alt='akerman.jpg' height='25' width='25'>";
	}
	else if(x.innerHTML.indexOf("Anderson Hall") != -1){
		popImg.innerHTML = "<img src='anderson.jpg' alt='anderson.jpg' height='25' width='25'>";
	}
	x.appendChild(popImg);
}

function popOutImg(x){
	x.removeChild(x.lastChild);
}

var map;
var geocoder = new google.maps.Geocoder();
var initLoc = {lat: 44.9727, lng: -93.23540000000003};
var service;
var markers = [];
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 44.9727, lng: -93.23540000000003},
	  zoom: 14
	});
	placeMarker();
	findcurrentlocation();
}

function enableTextBox(){
	if(document.getElementById("placeCategory").value === "Other"){
		document.getElementById("other").disabled = false;
	}
	else if(document.getElementById("placeCategory").value !== "Other"){
		
		document.getElementById("other").disabled = true;
	}
}

function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

var eventLocations = [];
var eventNames = [];
function placeMarker(){
	var j = 0;
	var addresses = document.getElementsByClassName('location');
	var eNames = document.getElementsByClassName('eventName');
	for(var i = 0; i < addresses.length; i++){
		eventLocations.push(addresses[i].textContent);
		eventNames.push(eNames[i].textContent);
	}
	for(var i = 0; i < addresses.length; i++){
		geocoder.geocode( {'address': eventLocations[i]}, function (results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				var latitude = results[0].geometry.location.lat();
				var longitude = results[0].geometry.location.lng();
				createMarker(latitude, longitude, eventNames[j], eventLocations[j]);
				j++;
			}
		});
	}
}

function createMarker(latitude, longitude, eName, addr){
    var marker = new google.maps.Marker({
        map: map,
        position: {lat: latitude, lng: longitude},
		icon: "./marker.png",
		animation: google.maps.Animation.DROP
    });
	markers.push(marker);
	var infowindow = new google.maps.InfoWindow({
		content: "<span style='text-align: left;'><b>" + eName + "</b><br>Address: " + addr + "</span>"
	});
	marker.addListener('mouseover', function() {
		infowindow.open(map, marker);
	});
	marker.addListener('mouseout', function () {
		infowindow.close();
	});
}

function search(){
	if (initLoc !== null){
        map = new google.maps.Map(document.getElementById('map'), {
			center: initLoc,
			zoom: 14
		});
		document.getElementById("directionPanel").style.display = "none";
    }
	setMapOnAll(null);
	service = new google.maps.places.PlacesService(map);
	if(document.getElementById("placeCategory").value === "Other"){
		var searchType = document.getElementById("other").value.toLowerCase();
		service.textSearch({
			location: initLoc,
			radius: document.getElementById("radiusInput").value.toString(),
			query: searchType
		}, callback);
	}
	else{
		var searchType = document.getElementById("placeCategory").value.toLowerCase();
		service.nearbySearch({
			location: initLoc,
			radius: document.getElementById("radiusInput").value.toString(),
			type: [searchType]
		}, callback);
	}
}

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createPlaceMarker(results[i]);
		}
	}
}

function createPlaceMarker(place) {
	var infowindow = new google.maps.InfoWindow();
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	markers.push(marker);
	
	var request = { reference: place.reference };
    service.getDetails(request, function(details, status) {
		google.maps.event.addListener(marker, 'mouseover', function() {
			infowindow.setContent("<span style='text-align: left;'><b>" + details.name + "</b><br>Address: " + details.formatted_address + "</span>");
			infowindow.open(map, this);
		});
		google.maps.event.addListener(marker, 'mouseout', function() {
			infowindow.close();
		});
    });
}

function findcurrentlocation() {
    var infoWindow = new google.maps.InfoWindow;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            map.setCenter(pos);
			initLoc = pos;
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
						  'Error: The Geolocation service failed.' :
						  'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

function directions() {
	document.getElementById("directionPanel").style.display = "block";
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: initLoc,
        mapTypeId: 'roadmap',
        zoom: 14
    });
    var directionsDisplay = new google.maps.DirectionsRenderer({
        panel: document.getElementById('directionPanel')
    });
    document.getElementById('directionPanel').innerHTML = '';
    directionsDisplay.setMap(map);
    var destination = document.getElementById("destinationValue").value;
    displayRoute(initLoc, destination, directionsService, directionsDisplay);
    
}

function displayRoute(source, destination, service, display) {
    var selectedMode;
	var radios = document.getElementsByName('travelMode');
	for (var i = 0; i < radios.length; i++){
		if (radios[i].checked)
		{
			selectedMode = radios[i].value;
			break;
		}
	}
    service.route({
        origin: new google.maps.LatLng(source),
        destination: destination,
        travelMode: google.maps.TravelMode[selectedMode]
    }, function (response, status) {
        if (status === 'OK') {
            display.setDirections(response);
        } else {
            alert('Could not display directions due to: ' + status);
        }
    });
}

//JavaScript Code for form.html
function validate(){
	var event = document.getElementById("eName").value;
	var location = document.getElementById("lName").value;
	var regExp = /^[0-9a-zA-Z ]+$/;
	
	if(event.search(regExp) !== 0 || location.search(regExp) !== 0){
		alert("Event Name and Location must be alphanumeric");
		return false;
	}
	return true;
}

//JavaScript Code for myWidgets.html
var count = 0;
var prevColor = '';
var winConditions = [
	['one', 'two', 'three'],
	['four', 'five', 'six'],
	['seven', 'eight', 'nine'],
	['one', 'four', 'seven'],
	['two', 'five', 'eight'],
	['three', 'six', 'nine'],
	['one', 'five', 'nine'],
	['three', 'five', 'seven']
];

function winCheck(){
	for(var i = 0; i < 8; i++){
		var tick1 = document.getElementById(winConditions[i][0]).style.backgroundColor;
		var tick2 = document.getElementById(winConditions[i][1]).style.backgroundColor;
		var tick3 = document.getElementById(winConditions[i][2]).style.backgroundColor;
		if(tick1 === 'rgb(255, 82, 82)' && tick2 === 'rgb(255, 82, 82)' && tick3 === 'rgb(255, 82, 82)'){
			alert("Red Player Wins!!");
			clearGame();
		}
		else if(tick1 === 'rgb(3, 193, 255)' && tick2 === 'rgb(3, 193, 255)' && tick3 === 'rgb(3, 193, 255)'){
			alert("Blue Player Wins!!");
			clearGame();
		}
	}
	if(count === 9){
		alert("Tied Game!!");
		clearGame();
	}
}

function playGame(){
	var inpName = document.getElementById("name").value.toLowerCase();
	var inpColor = document.getElementById("color").value;
	var tickColor = '';
	var regExp = /^[0-9a-zA-Z]+$/;
	
	if(inpName.search(regExp) !== 0){
		alert("Cell Name must be alphabetic");
		return false;
	}
	
	if(inpColor === 'Red(o)' && prevColor !== 'Red(o)'){
		tickColor = '#ff5252';
	}
	else if(inpColor === 'Blue(x)' && prevColor !== 'Blue(x)'){
		tickColor = '#03c1ff';
	}
	else{
		alert("Pick the other color. It's the next player's turn");
		return false;
	}
	
	if(inpName === 'one' || inpName === '1'){
		if(document.getElementById("one").style.backgroundColor === "rgb(117, 117, 117)"){
			document.getElementById("one").style.backgroundColor = tickColor;
		}
		else{
			alert("The chosen cell is already ticked. Choose another one");
			return false;
		}
	}
	else if(inpName === 'two' || inpName === '2'){
		if(document.getElementById("two").style.backgroundColor === "rgb(117, 117, 117)"){
			document.getElementById("two").style.backgroundColor = tickColor;
		}
		else{
			alert("The chosen cell is already ticked. Choose another one");
			return false;
		}
	}
	else if(inpName === 'three' || inpName === '3'){
		if(document.getElementById("three").style.backgroundColor === "rgb(117, 117, 117)"){
			document.getElementById("three").style.backgroundColor = tickColor;
		}
		else{
			alert("The chosen cell is already ticked. Choose another one");
			return false;
		}
	}
	else if(inpName === 'four' || inpName === '4'){
		if(document.getElementById("four").style.backgroundColor === "rgb(117, 117, 117)"){
			document.getElementById("four").style.backgroundColor = tickColor;
		}
		else{
			alert("The chosen cell is already ticked. Choose another one");
			return false;
		}
	}
	else if(inpName === 'five' || inpName === '5'){
		if(document.getElementById("five").style.backgroundColor === "rgb(117, 117, 117)"){
			document.getElementById("five").style.backgroundColor = tickColor;
		}
		else{
			alert("The chosen cell is already ticked. Choose another one");
			return false;
		}
	}
	else if(inpName === 'six' || inpName === '6'){
		if(document.getElementById("six").style.backgroundColor === "rgb(117, 117, 117)"){
			document.getElementById("six").style.backgroundColor = tickColor;
		}
		else{
			alert("The chosen cell is already ticked. Choose another one");
			return false;
		}
	}
	else if(inpName === 'seven' || inpName === '7'){
		if(document.getElementById("seven").style.backgroundColor === "rgb(117, 117, 117)"){
			document.getElementById("seven").style.backgroundColor = tickColor;
		}
		else{
			alert("The chosen cell is already ticked. Choose another one");
			return false;
		}
	}
	else if(inpName === 'eight' || inpName === '8'){
		if(document.getElementById("eight").style.backgroundColor === "rgb(117, 117, 117)"){
			document.getElementById("eight").style.backgroundColor = tickColor;
		}
		else{
			alert("The chosen cell is already ticked. Choose another one");
			return false;
		}
	}
	else if(inpName === 'nine' || inpName === '9'){
		if(document.getElementById("nine").style.backgroundColor === "rgb(117, 117, 117)"){
			document.getElementById("nine").style.backgroundColor = tickColor;
		}
		else{
			alert("The chosen cell is already ticked. Choose another one");
			return false;
		}
	}
	else{
		alert("Only enter one of the Cell Names");
		return false;
	}
	prevColor = inpColor;
	count++;
	//winCheck();
	setTimeout(winCheck, 5);
	return true;
}

function clearGame(){
	count = 0;
	prevColor = '';
	document.getElementById("name").value = "";
	document.getElementById("one").style.backgroundColor = "#757575";
	document.getElementById("two").style.backgroundColor = "#757575";
	document.getElementById("three").style.backgroundColor = "#757575";
	document.getElementById("four").style.backgroundColor = "#757575";
	document.getElementById("five").style.backgroundColor = "#757575";
	document.getElementById("six").style.backgroundColor = "#757575";
	document.getElementById("seven").style.backgroundColor = "#757575";
	document.getElementById("eight").style.backgroundColor = "#757575";
	document.getElementById("nine").style.backgroundColor = "#757575";
}