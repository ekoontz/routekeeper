var net = require('net');
net.createServer(function (socket) {
	socket.setEncoding("utf8");
	socket.write("Echo server\r\n");
	socket.on("data", function (data) {
		socket.write(data);
	    });
	socket.on("end", function () {
		socket.end();
	    });
    }).listen(8124, "127.0.0.1");
