var http = require('http');
var url_req = require('url');
var fs = require('fs');
var fs_prefix = "/home/ekoontz/routekeeper";

var path_to_alias = {
    "/": "/hello.html"
}

function lat(url_string) {
    return url_req.parse(url_string,true).query.lat;
}

function lng(url_string) {
    return url_req.parse(url_string,true).query.lng;
}

function get_pathname(url_string) {
    return url_req.parse(url_string).pathname;
}

function log(status,req,content_type) {
    content_type = typeof(content_type) != 'undefined' ? content_type : "";
    var alias_log = "";
    if (path_to_alias[req.url]) {
	alias_log = " (=>" + path_to_alias[req.url] +  ")";
    }
    console.log(status + " " + req.url + alias_log + " ("+content_type+")");
}

function routes(req,res,pathname) {
    // 1. static 
    pathname_components = pathname.match(new RegExp('^/([^/]+)[.](js|html|css)$'));

    if (pathname_components) {
	var stem = pathname_components[1];
	var suffix = pathname_components[2];
	var content_type = "text/"+suffix;
	return function(req,res) {
	    var filename = fs_prefix + "/" + stem + "." + suffix;
	    fs.readFile(filename, function (err, data) {
		    if (err) {
			log("500",req);
			res.writeHead(500, {'Content-Type': "text/html"});
			res.write("<h1>Error processing URL: " + req.url+"</h1>");
			res.write("<h2><tt>server.js</tt> details:</h2>");
			res.write("<div class='error details'>");
			res.write("<table>");
			res.write("<tr><th>url handler</th><td>static</td></tr>");
			res.write("<tr><th>stem</th><td>"+stem+"</td></tr>");
			res.write("<tr><th>suffix</th><td>"+suffix+"</td></tr>");
			res.write("<tr><th>filename</th><td>"+filename+"</td></tr>");
			res.write("</table>");
			
			res.write("</div>");
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

	    // FIXME: catch() node.js errors:
	    /* events:12
		throw arguments[1];
                       ^
		Error: ETIMEDOUT, Connection timed out
		at IOWatcher.callback (net:871:22)
		at node.js:773:9
	    */
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

function dispatch(req,res,pathname) {
    pathname = typeof(pathname) != 'undefined' ? pathname : get_pathname(req.url);

    var alias = path_to_alias[pathname];
    if (alias) {
	return dispatch(req,res,alias);
    }

    var route = routes(req,res,pathname);
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
var port = 8124;
console.log("starting routekeeper server: listening on port: " + port.toString());

http.createServer(function (req,res) {
	dispatch(req,res);
    }).listen(port);

