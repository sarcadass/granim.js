'use strict';

module.exports = {
	init: function() {
		this.examples.init();
	},

	examples: {
		init: function() {
			this.basic();
			this.radial();
			this.image();
			this.imageMask();
			this.interactive();
		},

		basic: function() {
			var animation = new Granim({
				element: '#canvas-basic',
				name: 'basic-gradient',
				direction: 'left-right',
				opacity: [1, 1],
				isPausedWhenNotInView: true,
				states : {
					"default-state": {
						gradients: [
							['#AA076B', '#61045F'],
							['#02AAB0', '#00CDAC'],
							['#DA22FF', '#9733EE']
						]
					}
				}
			});
		},

		radial: function() {
			var animation = new Granim({
				element: '#canvas-radial',
				name: 'radial-gradient',
				direction: 'radial',
				opacity: [1, 1],
				isPausedWhenNotInView: true,
				states : {
					"default-state": {
						gradients: [
							['#ffb347', '#ffcc33'],
							['#83a4d4', '#b6fbff'],
							['#9D50BB', '#6E48AA']
						]
					}
				}
			});
		},

		image: function() {
			var animation = new Granim({
				element: '#canvas-image',
				direction: 'top-bottom',
				opacity: [1, .5, 0],
				isPausedWhenNotInView: true,
				states : {
					"default-state": {
						gradients: [
							['#485563', '#29323c', '#29323c'],
							['#556270', '#FF6B6B', '#FF6B6B']
						],
						transitionSpeed: 10000
					}
				}
			});
		},

		imageMask: function() {
			var animation = new Granim({
				element: '#canvas-image-mask',
				direction: 'left-right',
				opacity: [1, 1],
				isPausedWhenNotInView: true,
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
						transitionSpeed: 2000
					}
				}
			});
		},

		interactive: function() {
			var animation = new Granim({
				element: '#canvas-interactive',
				name: 'interactive-gradient',
				elToSetClassOn: '.canvas-interactive-wrapper',
				direction: 'diagonal',
				opacity: [1, 1],
				isPausedWhenNotInView: true,
				stateTransitionSpeed: 500,
				states : {
					"default-state": {
						gradients: [
							['#B3FFAB', '#12FFF7'],
							['#ADD100', '#7B920A'],
							['#1A2980', '#26D0CE']
						],
						transitionSpeed: 10000
					},
					"violet-state": {
						gradients: [
							['#9D50BB', '#6E48AA'],
							['#4776E6', '#8E54E9']
						],
						transitionSpeed: 2000
					},
					"orange-state": {
						gradients: [ ['#FF4E50', '#F9D423'] ],
						loop: false
					}
				}
			});

			$('#default-state-cta').on('click', function(event) {
				event.preventDefault();
				animation.changeState('default-state');
				setClass('#default-state-cta')
			});
			$('#violet-state-cta').on('click', function(event) {
				event.preventDefault();
				animation.changeState('violet-state');
				setClass('#violet-state-cta')
			});
			$('#orange-state-cta').on('click', function(event) {
				event.preventDefault();
				animation.changeState('orange-state');
				setClass('#orange-state-cta')
			});

			function setClass(element) {
				$('.canvas-interactive-wrapper a').removeClass('active');
				$(element).addClass('active');
			}
		}
	}
};
