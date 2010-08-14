var net = require('net');
var http = require('http');
var qs = require('querystring');
var url = require('url');

function lat(url_string) {
    return url.parse(url_string,true).query.lat;
}

function lng(url_string) {
    return url.parse(url_string,true).query.lng;
}

console.log("starting google proxy.");

http.createServer(function (req,res) {

	var google = http.createClient(80, 'maps.google.com');
	google_url = "/maps/api/geocode/json?latlng=" + lat(req.url) + "," + lng(req.url) + "&sensor=true";

	var request = google.request('GET', google_url,
				     {'host': 'maps.google.com'});
	request.end();

	request.on('response', function (response) {
		console.log(google_url + ' STATUS: ' + response.statusCode);
		// content_type should normally be: 
		//    'application/json; charset=UTF-8'
		content_type = response.headers['content-type'];
		console.log(" content type: " + response.headers['content-type']);
		
		response.setEncoding('utf8');
		res.writeHead(200, {'Content-Type': content_type});

		response.on('data', function (chunk) {
			res.write(chunk);
		    });
		response.on('end',function() {
			res.end();
		    });
	    });


    }).listen(8124);

