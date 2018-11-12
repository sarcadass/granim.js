'use strict';

var baseURL = location.hostname.indexOf('localhost') !== -1
	? '' : 'granim.js/';

module.exports = {
	init: function() {
		this.setDefaultVersionOnDropDown();
		this.HandleVersionDropDown();
		
	},

	setDefaultVersionOnDropDown: function() {
		var pathnameSplit = location.pathname.split('/');
		var pathName = pathnameSplit[pathnameSplit.length - 1];
		$('#version-select option').each(function(i, el) {
			if (el.value === pathName) {
				$(el).attr({ selected: true });
			}
		});
	},

	HandleVersionDropDown: function() {
		$('#version-select').on('change', function(event) {
			$(location).attr({ pathname: baseURL + $(this).val() });
		});
	}
};
