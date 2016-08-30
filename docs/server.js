'use strict';

var Hapi = require('hapi'),
	modulePckg = require('./../package.json'),
	httpPort, httpPortArg;

var server = new Hapi.Server();

if (process.argv[2] !== undefined) {
// If an arg is provided
	httpPortArg = process.argv[2].split('=')[0];
	// If: 'port', '-port', '--port' arg is provided, use it to set the port
	if (httpPortArg === 'port' || httpPortArg ===  '-port' || httpPortArg ===  '--port') {
		httpPort = !isNaN(process.argv[2].split('=')[1]) ? process.argv[2].split('=')[1] : undefined;
	}
}

// If arg is not set
if (httpPort === undefined) {
	if (!isNaN(process.env.PORT)) {
		// If: PORT is defined
		httpPort = process.env.PORT;

	} else if (!isNaN(modulePckg.httpPort)) {
		// Else if: httpPort key is defined in 'package.json'
		httpPort = modulePckg.httpPort;

	} else {
		// Else: set the port to 8080
		httpPort = 8080
	}
}

server.connection({ port: httpPort });

server.register(require('inert'), function(err) {
	if (err) {
		throw err;
	}

	server.route({
		method: 'GET',
		path: '/',
		handler: function(request, reply) {
			reply.file('./index.html');
		}
	});

	server.route({
		method: 'GET',
		path: '/{param*}',
		handler: function(request, reply) {
			reply.file('./' + request.path);
		}
	});
	server.start(function(err) {
		if (err) {
			throw err;
		}

		console.log('Server running at:', server.info.uri);
	});
});
