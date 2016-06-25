var arrayCine = [];
var nameCines = [];
function createCine (name,lat,lon) {
	var ojbCine = {
		name: name,
		lat: lat,
		lon: lon
	}	
	return ojbCine;
}

$('#btnSave').click(function(){
	var newCine = createCine($('#inputName').val(), $('#inputLat').val(), $('#inputLon').val());
	arrayCine.push(newCine);
	addStorage("cineStorage", JSON.stringify(arrayCine));
});

function addStorage(name,array) {
	window.localStorage.setItem(name, array);
}

function loadStorage (name){
	if (window.localStorage.getItem(name) == null){
		arrayCine = [];
	}else{
		arrayCine = JSON.parse(window.localStorage.getItem(name));
	}
}
$('#btnDelete').click(function(){
	$('#lista_cine').empty();
	window.localStorage.removeItem("cineStorage");
});

$('#btnMap').click(function(){

	var options = {
		enableHighAccuracy: true
	};

	navigator.geolocation.getCurrentPosition(onLocation, onError, options);

	function onLocation (position) {
		console.log('Your latitude is ' + position.coords.latitude);
		console.log('Your longitude is ' + position.coords.longitude);
		var userPosition = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}
		var closestCine = [getClosestCine(userPosition)];
		var cineSelected = arrayCine[closestCine];
		var arrCine = [];
		arrCine.push(cineSelected)
		showMap(arrCine, userPosition);
		

	}

	function onError (error) {
		console.error(error);
	}
});

//All cines
$('#btnAllCine').click(function(){

	var options = {
		enableHighAccuracy: true
	};

	navigator.geolocation.getCurrentPosition(onLocation, onError, options);

	function onLocation (position) {
		
		console.log('Your latitude is ' + position.coords.latitude);
		console.log('Your longitude is ' + position.coords.longitude);
		var userPosition = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}
		addDistanceCine (userPosition);
		sortCine();
		showMap(arrayCine, userPosition);
		printCineByDistance();
		document.getElementById("music").play();
	}

	function onError (error) {
		console.error(error);
	}
});

function getClosestCine (userPosition) {
	var distanceClosest = 1000;
	var indexCine;
	arrayCine.forEach(function(cine, index){
		var distanceCine = distance(userPosition.latitude, userPosition.longitude, cine.lat, cine.lon,"");
		//console.log(distanceCine);//Distancia de todos los cines a nuestro punto
		if (distanceCine<distanceClosest) {
			distanceClosest = distanceCine;
			indexCine=index;
			nameCines.push(cine.name);
			
		}
	})
	
	return indexCine;
}

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var radlon1 = Math.PI * lon1/180
	var radlon2 = Math.PI * lon2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.853159

	return dist
}

function showMap (arrayCine, userPosition){
	console.log("-->"+arrayCine.name);

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: new google.maps.LatLng(userPosition.latitude, userPosition.longitude),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var locations = [
	['You', userPosition.latitude, userPosition.longitude, 5],
	];
	for (var i = 0; i < arrayCine.length; i++) {
		console.log(arrayCine[i].name+" "+ arrayCine[i].lat+" "+arrayCine[i].lon)
		var element = [arrayCine[i].name, arrayCine[i].lat, arrayCine[i].lon, 5];
		console.log(element);
		locations.push(element);
	}
	console.log(locations);

	var infowindow = new google.maps.InfoWindow();
	var marker, i;

	for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			map: map
		});
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				infowindow.setContent(locations[i][0]);
				infowindow.open(map, marker);
			}
		})(marker, i));
	}

}
function addDistanceCine (userPosition){
	arrayCine.forEach(function (cine){
		cine.distance = distance(userPosition.latitude, userPosition.longitude, cine.lat, cine.lon,"");
	});

}
function sortCine(){
	function compare(a,b) {
  		if (a.distance < b.distance)
    		return -1;
  		if (a.distance> b.distance)
    		return 1;
  		return 0;
	}
	arrayCine.sort(compare);
					
}
function printCineByDistance (){
	$('#lista_cine').empty();
	var html ='<h2>Lista de cines ordenados por cercanía</h2>'+
			  '<ol>';
	for (var i = 0; i < arrayCine.length; i++){
		html += '<li>'+arrayCine[i].name+'</li>';
	}
	html += '<ol>';
	html += '<img src="img/dora.png" alt="">';
	$("#lista_cine").append(html);
}