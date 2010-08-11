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

    address = "123 Main St.";
    $("#addresslist").append("<li class='loc'>"+address+"</li>");

    /* 

      Do ajax call e.g. : 
     e.g.:
       curl "http://maps.google.com/maps/api/geocode/json?latlng=37.79,-122.444&sensor=true"
     (See also: http://code.google.com/apis/maps/documentation/geocoding/#ReverseGeocoding)

     Will return JSON that looks like: 

{
  "status": "OK",
  "results": [ {
    "types": [ "street_address" ],
    "formatted_address": "2038 Baker St, San Francisco, CA 94115, USA",
..
     } ]
..
}

*/
    

}
