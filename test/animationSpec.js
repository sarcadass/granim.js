describe('Animation: ', function() {
	var event = document.createEvent('HTMLEvents');
	var value, granimInstance, gradientColor, canvas,
		canvasWidthMiddle, canvasHeightMiddle;

	beforeEach(function(done) {
		setTimeout(function() {
			value = 0;
			done();
		}, 1);
	});

	it("should support async execution of test preparation and expectations", function(done) {
		canvas = setCanvas();
		granimInstance = new Granim({
			element: '#granim-canvas',
			name: 'granim',
			direction: 'left-right',
			opacity: [1, 1],
			states : {
				"default-state": {
					gradients: [
						['#BA8B02', '#181818'],
						['#7b4397', '#dc2430']
					],
					transitionSpeed: 250,
					loop: true
				}
			}
		});
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
			}, 250);
		});

		afterEach(function() {
			jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		});
	});
});
