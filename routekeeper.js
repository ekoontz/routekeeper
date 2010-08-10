var map;

function initialize() {
    var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
    var myOptions = {
	zoom: 4,
	center: myLatlng,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
			      myOptions);
    
    google.maps.event.addListener(map, 'zoom_changed', function() {
	setTimeout(moveToDarwin, 1000);
    });
    
    var marker = new google.maps.Marker({
	position: myLatlng, 
	map: map,
	title:"Hello World!"
    });

    google.maps.event.addListener(marker, 'click', function() {
	map.setZoom(8);
    });
}
  
  function moveToDarwin() {
      var darwin = new google.maps.LatLng(-12.461334, 130.841904);
      map.setCenter(darwin);
  }


