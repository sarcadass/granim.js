'use strict';

var codeTemplates = require('../utils/codeTemplate.js');

module.exports = {
	init: function() {
		this.examples.init();
	},

	examples: {
		init: function() {
			this.basic();
			this.complex();
			this.imageBlending();
			this.imageMask();
			this.interactive();
		},

		basic: function() {
			var animation = new Granim({
				element: '#canvas-basic',
				direction: 'left-right',
				customDirection: {
					x0: '40%',
					y0: '10px',
					x1: '60%',
					y1: '50%'
				},
				isPausedWhenNotInView: true,
				states: {
					"default-state": {
						gradients: [
							['#ff9966', '#ff5e62'],
							['#00F260', '#0575E6'],
							['#e1eec3', '#f05053']
						]
					}
				}
			});

			$('#select-direction').on('change', function() {
				var directionValue = $(this).val();
				animation.changeDirection(directionValue);

				$('#canvas-basic-bloc .language-js').html(
					$(codeTemplates.basic({ direction: directionValue }))
				);
				Prism.highlightAll();
			})
		},

		complex: function() {
			var animation = new Granim({
				element: '#canvas-complex',
				direction: 'left-right',
				isPausedWhenNotInView: true,
				states: {
					"default-state": {
						gradients: [
							[
								{ color: '#833ab4', pos: .2 },
								{ color: '#fd1d1d', pos: .8 },
								{ color: '#38ef7d', pos: 1 }
							], [
								{ color: '#40e0d0', pos: 0 },
								{ color: '#ff8c00', pos: .2 },
								{ color: '#ff0080', pos: .75 }
							]
						]
					}
				}
			});
		},

		imageBlending: function() {
			var animation = new Granim({
				element: '#canvas-image-blending',
				direction: 'top-bottom',
				isPausedWhenNotInView: true,
				image: {
					source: '../granim.js/assets/img/bg-forest.jpg',
					position: ['center', 'center'],
					stretchMode: ['stretch-if-smaller', 'stretch-if-bigger'],
					blendingMode: 'multiply'
				},
				states: {
					"default-state": {
						gradients: [
							['#29323c', '#485563'],
							['#FF6B6B', '#556270'],
							['#80d3fe', '#7ea0c4'],
							['#f0ab51', '#eceba3']
						],
						transitionSpeed: 7000
					}
				}
			});

			$('#select-blending-mode').on('change', function() {
				var blendingModeValue = $(this).val();
				animation.changeBlendingMode(blendingModeValue);

				$('#canvas-image-blending-bloc .language-js').html(
					$(codeTemplates.blendingMode({ blendingMode: blendingModeValue }))
					);
				Prism.highlightAll();
			})
		},

		imageMask: function() {
			var animation = new Granim({
				element: '#canvas-image-mask',
				direction: 'left-right',
				isPausedWhenNotInView: true,
				states: {
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

			$('.canvas-image-wrapper .logo-mask').on('click', function(event) {
				event.preventDefault();
			})
		},

		interactive: function() {
			var animation = new Granim({
				element: '#canvas-interactive',
				name: 'interactive-gradient',
				elToSetClassOn: '.canvas-interactive-wrapper',
				direction: 'diagonal',
				isPausedWhenNotInView: true,
				stateTransitionSpeed: 500,
				states: {
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
						gradients: [['#FF4E50', '#F9D423']],
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
