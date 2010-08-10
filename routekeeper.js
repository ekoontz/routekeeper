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
    $("#markerlist").append("<div>You chose location:..</div>");
    
}
