var http = require('http');
var url_req = require('url');
var fs = require('fs');
var fs_prefix = "/home/ekoontz/routekeeper";


function lat(url_string) {
    return url_req.parse(url_string,true).query.lat;
}

function lng(url_string) {
    return url_req.parse(url_string,true).query.lng;
}

function pathname(url_string) {
    return url_req.parse(url_string).pathname;
}

function log(status,req,content_type) {
    content_type = typeof(content_type) != 'undefined' ? content_type : "";
    console.log(status + " " + req.url + " ("+content_type+")");
}

function routes(pathname,req,res) {
    // 1. static 
    retval = pathname.match(new RegExp('^/[^/]+[.](js|html|css)$'));

    if (retval) {
	var content_type = "text/"+retval[1];
	return function(req,res) {
	    var filename = fs_prefix + retval[0];
	    fs.readFile(filename, function (err, data) {
		    if (err) {
			log("500",req);
			res.writeHead(500, {'Content-Type': "text/html"});
			res.write("<h2>Error processing URL: " + req.url+"</h2>");
			res.end();
		    }
		    else {
			res.writeHead(200, {'Content-Type': content_type});
			res.write(data);
			res.end();
			log("200",req,content_type);
		    }
		});
	}
    }

    // 2. dynamic: google map proxy
    if (pathname == "/map") {
	return function (req,res) {
	    var google = http.createClient(80, 'maps.google.com');
	    google_url = "/maps/api/geocode/json?latlng=" + lat(req.url) + "," + lng(req.url) + "&sensor=true";
	
	    var request = google.request('GET', google_url,{'host': 'maps.google.com'});
	    request.end();
	    
	    request.on('response', function (response) {
		    // content_type should be: 
		    //    'application/json; charset=UTF-8'
		    content_type = response.headers['content-type'];
		    
		    response.setEncoding('utf8');
		    res.writeHead(200, {'Content-Type': content_type});
		    response.on('data', function (chunk) {
			    res.write(chunk);
			});
		    response.on('end',function() {
			    res.end();
			    log("200",req,content_type);
			});
		});
	}
    }
    
};

function dispatch(req,res) {
    var route = routes(pathname(req.url),req,res);
    if (route) {
	route(req,res);
    }
    else {
	log("404",req);
	res.writeHead(404, {'Content-Type': "text/html"});
	res.write("<h2>No route found for URL: " + req.url+"</h2>");
	res.end();
    }
}

console.log("starting google proxy.");

http.createServer(function (req,res) {
	dispatch(req,res);
    }).listen(8124);

