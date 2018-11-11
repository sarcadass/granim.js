/* eslint-disable */

describe('Image: ', function() {
	var granimInstance, gradientColor, canvas,
		canvasWidthMiddle, canvasHeightMiddle;
	var event = document.createEvent('HTMLEvents');

	beforeEach(function(done) {
		setTimeout(function() {
			value = 0;
			done();
		}, 1);
	});

	it('should support async execution of test preparation and expectations with image setup', function(done) {
		canvas = setCanvas();
		granimInstance = new Granim({
			element: '#granim-canvas',
			name: 'basic-gradient',
			direction: 'top-bottom',
			opacity: [1, 1, 1],
			isPausedWhenNotInView: true,
			image: {
				source: 'img/800x200.jpg',
				position: ['left', 'center'],
				stretchMode: ['stretch', 'stretch'],
				blendingMode: 'multiply'
			},
			states: {
				'default-state': {
					gradients: [
						['#485563', '#29323c', '#29323c'],
						['#556270', '#FF6B6B', '#FF6B6B']
					]
				}
			}
		});
		document.createEvent('HTMLEvents');
		event.initEvent('resize', true, false);
		window.dispatchEvent(event);
		canvasWidthMiddle = (canvas.width - 50) / 2;
		canvasHeightMiddle = (canvas.height - 50) / 2;
		gradientColor = granimInstance.context.getImageData(canvasWidthMiddle, canvasHeightMiddle, 5, 5);
		expect(granimInstance).toBeDefined();
		done();
	});

	describe('Asynchronous specs: User inputs validation', function() {
		var originalTimeout;
		beforeEach(function() {
			originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		});

		it('throws error on invalid element "image.position"', function(){
			function updateInstanceWithWrongParams() {
				return new Granim({
					element: '#granim-canvas',
					name: 'basic-gradient',
					direction: 'top-bottom',
					opacity: [1, 1, 1],
					isPausedWhenNotInView: true,
					image: {
						source: 'img/800x200.jpg',
						// position should be [x, y], here it's [y, x]
						position: ['top', 'left']
					},
					states: {
						'default-state': {
							gradients: [
								['#485563', '#29323c', '#29323c'],
								['#556270', '#FF6B6B', '#FF6B6B']
							]
						}
					}
				});
			}
			expect(updateInstanceWithWrongParams).toThrowError(
				'Granim: Input error on "image.position" option.\nCheck the API https://sarcadass.github.io/granim.js/api.html.'
			);
		});

		it('throws error on invalid element "image.stretchMode"', function(){
			function updateInstanceWithWrongParams() {
				return new Granim({
					element: '#granim-canvas',
					name: 'basic-gradient',
					direction: 'top-bottom',
					opacity: [1, 1, 1],
					isPausedWhenNotInView: true,
					image: {
						source: 'img/800x200.jpg',
						position: ['right', 'bottom'],
						// mistake on 'stretch-if-smaller'
						stretchMode: ['stretch-if-smaler', 'stretch']
					},
					states: {
						'default-state': {
							gradients: [
								['#485563', '#29323c', '#29323c']
							]
						}
					}
				});
			}
			expect(updateInstanceWithWrongParams).toThrowError(
				'Granim: Input error on "image.stretchMode" option.\nCheck the API https://sarcadass.github.io/granim.js/api.html.'
			);
		});

		afterEach(function() {
			jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		});
	});

	describe('Asynchronous specs: Animation with an image', function() {
		var originalTimeout;
		beforeEach(function() {
			originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		});

		it('Gradient animation is working', function(done) {
			setTimeout(function() {
				var isSameGradientImage = compareImages(gradientColor,
					granimInstance.context.getImageData(canvasWidthMiddle, canvasHeightMiddle, 5, 5));
				expect(isSameGradientImage).toBe(false);
				done();
			}, 500);
		});

		it('ChangeBlendingMode method is working', function(done) {
			granimInstance.changeBlendingMode('screen');
			setTimeout(function() {
				expect(granimInstance.image.blendingMode).toEqual('screen');
				done();
			}, 200);
		});

		it('Gradient animation is working without "image.position" and/or "image.stretchMode" set', function(done) {
			canvas.style.height = '100px';
			granimInstance = new Granim({
				element: '#granim-canvas',
				name: 'basic-gradient',
				direction: 'radial',
				opacity: [1, 1, 1],
				isPausedWhenNotInView: true,
				image: { source: 'img/800x200.jpg' },
				states: {
					'default-state': { gradients: [['#485563', '#29323c', '#29323c']] }
				}
			});

			expect(granimInstance).toBeDefined();
			done();
		});

		it('Different parameters are working 1/3', function(done) {
			granimInstance = new Granim({
				element: '#granim-canvas',
				name: 'basic-gradient',
				direction: 'radial',
				opacity: [1, 1, 1],
				isPausedWhenNotInView: true,
				image: {
					source: 'img/800x200.jpg',
					position: ['right', 'top'],
					stretchMode: ['stretch-if-bigger', 'stretch-if-bigger']
				},
				states: {
					'default-state': { gradients: [['#485563', '#29323c', '#29323c']] }
				}
			});

			expect(granimInstance).toBeDefined();
			done();
		});

		it('Different parameters are working 2/3', function(done) {
			granimInstance = new Granim({
				element: '#granim-canvas',
				name: 'basic-gradient',
				direction: 'radial',
				opacity: [1, 1, 1],
				isPausedWhenNotInView: true,
				image: {
					source: 'img/800x200.jpg',
					position: ['center', 'bottom'],
					stretchMode: ['none', 'stretch']
				},
				states: {
					'default-state': { gradients: [['#485563', '#29323c', '#29323c']] }
				}
			});

			expect(granimInstance).toBeDefined();
			done();
		});

		it('Different parameters are working 3/3', function(done) {
			canvas.style.height = '300px';
			granimInstance = new Granim({
				element: '#granim-canvas',
				name: 'basic-gradient',
				direction: 'radial',
				opacity: [1, 1, 1],
				isPausedWhenNotInView: true,
				image: {
					source: 'img/800x200.jpg',
					position: ['center', 'bottom'],
					stretchMode: ['stretch-if-smaller', 'stretch-if-smaller']
				},
				states: {
					'default-state': { gradients: [['#485563', '#29323c', '#29323c']] }
				}
			});

			expect(granimInstance).toBeDefined();
			done();
		});

		afterEach(function() {
			jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		});
	});
});
