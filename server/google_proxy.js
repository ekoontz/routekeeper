var http = require('http');
var url_req = require('url');
var fs = require('fs');

function lat(url_string) {
    console.log("url_string:" + url_string);
    return url_req.parse(url_string,true).query.lat;
}

function lng(url_string) {
    return url_req.parse(url_string,true).query.lng;
}

function pathname(url_string) {
    return url_req.parse(url_string).pathname;
}

var routes = {
    '/routekeeper/hello.html': function (req,res) {
	fs.readFile("/home/ekoontz/routekeeper/hello.html", function (err, data) {
		if (err) throw err;
		res.writeHead(200, {'Content-Type': "text/html"});
		res.write(data);
		res.end();
	    });
    },

    '/map': function (req,res) {

	var google = http.createClient(80, 'maps.google.com');
	google_url = "/maps/api/geocode/json?latlng=" + lat(req.url) + "," + lng(req.url) + "&sensor=true";
	
	var request = google.request('GET', google_url,{'host': 'maps.google.com'});
	request.end();
	
	request.on('response', function (response) {
		console.log(google_url + ' STATUS: ' + response.statusCode);
		// content_type should normally be: 
		//    'application/json; charset=UTF-8'
		content_type = response.headers['content-type'];
		console.log(" content type: " + response.headers['content-type']);
		
		response.setEncoding('utf8');
		//		res.writeHead(200, {'Content-Type': content_type});
		// for debugging: 'text/plain'; for production: content_type.
		res.writeHead(200, {'Content-Type': "text/plain"});
		response.on('data', function (chunk) {
			res.write(chunk);
		    });
		response.on('end',function() {
			res.end();
		    });
	    });
    }
};

function dispatch(pathname,req,res) {

    var route = routes[pathname];
    if (route) {
	route(req,res);
    }
    else {
	console.log("404: No route found for URL: " + req.url);
	res.writeHead(404, {'Content-Type': "text/html"});
	res.write("<h2>No route found for URL: " + req.url+"</h2>");
	res.end();
    }
}

console.log("starting google proxy.");

http.createServer(function (req,res) {
	dispatch(pathname(req.url),req,res);
    }).listen(8124);

