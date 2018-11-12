'use strict';

var main = require('./main.js');
var home = require('./pages/home.js');
var examples = require('./pages/examples.js');
var api = require('./pages/api.js');

$(document).on('DOMContentLoaded', function() {
	switch(pageId) {
		default:
		case 'homepage':
			home.init();
			break;

		case 'examples':
			main.init();
			examples.init();
			break;

		case 'api':
			main.init();
			api.init();
			break;
	}
});
