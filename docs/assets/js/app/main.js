'use strict';

module.exports = {
	init: function() {
		this.logoAnimation();
		this.hamburgerIcon();
	},

	logoAnimation: function() {
		setTimeout(function() {
			var logoGradient = new Granim({
				element: '#logo-canvas',
				direction: 'left-right',
				opacity: [1, 1],
				states : {
					"default-state": {
						gradients: [
							['#EB3349', '#F45C43'],
							['#FF8008', '#FFC837'],
							['#4CB8C4', '#3CD3AD'],
							['#24C6DC', '#514A9D'],
							['#FF512F', '#DD2476'],
							['#DA22FF', '#9733EE']
						],
						transitionSpeed: 3500
					}
				}
			});

			$('.main-header .bloc-logo').css({
				display: 'none',
				visibility: 'visible'
			})
				.fadeIn();
		}, 500);
	},

	hamburgerIcon: function() {
		$('.hamburger-icon').click(function(){
			$(this).toggleClass('open');
			$('.main-nav').toggleClass('open');
		});
	}
};
