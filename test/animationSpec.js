/* eslint-disable */

describe('Animation: ', function() {
	var event = document.createEvent('HTMLEvents');
	var granimInstance, gradientColor, canvas,
		canvasWidthMiddle, canvasHeightMiddle;
	var validOptions = {
			element: '#granim-canvas',
			name: 'granim',
			direction: 'left-right',
			opacity: [1, 1],
			states : {
				"default-state": {
					gradients: [
						['hsl(333, 56%,89%)', '#181818', 'rgba(25,63, 48, .75)'],
						['#7b4397', 'hsla(126,0%, 19%,.9)', 'rgb(69, 89,169)'],
						[{ color: '#833ab4', pos: .2 }, { color: 'rgb(255, 0,25)', pos: .6 }, { color: '#ff0080', pos: .95 }],
						['#222', 'hsl(0, 5%, 5%)', 'rgb(255, 0,0)'],
					],
					transitionSpeed: 100,
					loop: true
				}
			}
		};
	var newGranimInstance = function(options) { return new Granim(options) };

	beforeEach(function(done) {
		setTimeout(function() {
			value = 0;
			done();
		}, 1);
	});

	it('should support async execution of test preparation and expectations', function(done) {
		canvas = setCanvas();
		granimInstance = newGranimInstance(validOptions);
		event.initEvent('resize', true, false);
		window.dispatchEvent(event);
		canvasWidthMiddle = (canvas.width - 50) / 2;
		canvasHeightMiddle = (canvas.height - 50) / 2;
		gradientColor = granimInstance.context.getImageData(canvasWidthMiddle, canvasHeightMiddle, 5, 5);

		expect(granimInstance).toBeDefined();
		done();
	});

	describe('Asynchronous specs:', function() {
		var originalTimeout;
		beforeEach(function() {
			originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		});

		it('Gradient animation is working', function(done) {
			setTimeout(function() {
				var isSameGradientImage = compareImages(gradientColor, granimInstance.context.getImageData(canvasWidthMiddle, canvasHeightMiddle, 5, 5));
				expect(isSameGradientImage).toBe(false);
				done();
			}, 300);
		});

		it('Gradient animation with custom direction is working', function(done) {
			granimInstance.destroy();
			granimInstance = newGranimInstance(Object.assign(
				Object.assign({}, validOptions),
				{
					direction: 'custom',
					customDirection: {
						x0: '10%',
						y0: '25px',
						x1: '30%',
						y1: '322px'
					}
				}
			));
			
			setTimeout(function() {
				expect(granimInstance).toBeDefined();
				done();
			}, 300);
		});
 
		afterEach(function() {
			jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		});
	});
});
