function initialize() {
    var latlng = new google.maps.LatLng(37.46,-122.25);
    var myOptions = {
	zoom: 10,
	center: latlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
	myOptions);
}
