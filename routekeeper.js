var map;
function initialize() {
  var myLatlng = new google.maps.LatLng(37.79,-122.444922);
  var myOptions = {
    zoom: 14,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  google.maps.event.addListener(map, 'click', 
				function(event) {
				    placeMarker(event.latLng);
				});

    $("#markerlist").text("");
}
  
function placeMarker(location) {

    var clickedLocation = new google.maps.LatLng(location);
    var marker = new google.maps.Marker({
	position: location, 
	map: map
    });
    $("#markerlist").append("<li class='loc'>"+location.lat()+","+location.lng()+"</li>");

    $.ajax({ 
	// local proxy:
	// url: "http://localhost:8000/maps/api/geocode/json?latlng=" + location.lat() + "," + location.lng() + "&sensor=true",
	// if hosted on google.com:
	// url: "http://maps.google.com/maps/api/geocode/json?latlng=" + location.lat() + "," + location.lng() + "&sensor=true",
	// local or disconnected testing:
	url: "geocode_response.json",
	dataType: 'json',
	success: function(data,textStatus,XMLHttpRequest){
	    if (textStatus == "success") {
		if (data) {
		    address = data.results[0].formatted_address;
		    $("#addresslist").append("<li class='loc'>"+address+"</li>");
		}
		else {
		    alert('no data.');
		}
	    }
	}
    });

}
