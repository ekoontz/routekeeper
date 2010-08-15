var map;
var rowclass = "d0";
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
	url: "/map?lat=" + location.lat() + "&lng=" + location.lng() + "&sensor=true",
	dataType: 'json',
	success: function(data,textStatus,XMLHttpRequest){
	    if (textStatus == "success") {
		if (data) {
		    address = data.results[0].formatted_address;
		    $("#addresslist").append("<tr class='"+rowclass+"'><td>"+address+"</td></tr>");
		    if (rowclass == "d1"){   
		        rowclass="d0";
		    }
		    else {   
			rowclass="d1"; 
	            }   
		}
		else {
		    alert('no data.');
		}
	    }
	}
    });

}
