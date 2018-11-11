'use strict';

module.exports = {
	init: function() {
		this.setDefaultVersionOnDropDown();
		this.HandleVersionDropDown();
		
	},

	setDefaultVersionOnDropDown: function() {
		var pathName = document.location.pathname;
		$('#version-select option').each(function(i, el) {
			if (el.value === pathName) {
				$(el).attr({ selected: true })
			}
		})
	},

	HandleVersionDropDown: function() {
		$('#version-select').on('change', function(event) {
			$(location).attr({ pathname: $(this).val() })
		})
	}
};
